"""
Genera la música de fondo de la Pokédex: una pista lofi relajada y ORIGINAL, compuesta con código.
No usa ninguna melodía, sample ni grabación de otra persona, así que no tiene derechos de autor de terceros.

Uso (necesita numpy, scipy y ffmpeg):
    pip install numpy scipy
    python tools/generar_musica.py            # crea audio/musica-pokemon.mp3
Opciones:  --semilla 7   cambia las variaciones de la melodía.
"""
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np
from scipy import signal

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 32000                      # frecuencia de muestreo
BPM = 78
BEAT = 60.0 / BPM
BAR = BEAT * 4
SEMILLA = int(sys.argv[sys.argv.index("--semilla") + 1]) if "--semilla" in sys.argv else 7
rng = np.random.default_rng(SEMILLA)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12.0)


# Progresión de 4 compases (se repite): Am7 - Fmaj7 - Cmaj7 - G7
ACORDES = [
    dict(bajo=45, notas=[57, 60, 64, 67]),
    dict(bajo=41, notas=[53, 57, 60, 64]),
    dict(bajo=36, notas=[52, 55, 59, 62]),
    dict(bajo=43, notas=[55, 59, 62, 65]),
]
PENTA = [69, 72, 74, 76, 79, 81]    # La menor pentatónica

# Estructura: (compases, bateria, melodia)
SECCIONES = [(8, False, False), (16, True, False), (16, True, True), (8, False, True), (8, True, True)]
TOTAL_COMPASES = sum(s[0] for s in SECCIONES)
N = int(TOTAL_COMPASES * BAR * SR)
COLA = int(4 * SR)
mezcla = np.zeros((2, N + COLA))


def poner(pista, inicio, nota, pan=0.5, ganancia=1.0):
    i = int(inicio * SR)
    if i >= N:
        i -= N                       # lo que sobra al final vuelve al principio (bucle sin cortes)
    fin = min(i + len(nota), N + COLA)
    seg = nota[: fin - i]
    pista[0, i:fin] += seg * (1 - pan) * 2 * ganancia * 0.5
    pista[1, i:fin] += seg * pan * 2 * ganancia * 0.5


def piano(f, dur, vel=1.0):
    """Piano eléctrico suave: armónicos con caída y un poco de trémolo."""
    t = np.arange(int(dur * SR)) / SR
    y = np.zeros_like(t)
    for k, (amp, caida) in enumerate([(1.0, 1.6), (0.45, 3.0), (0.18, 4.5), (0.08, 6.0)], start=1):
        y += amp * np.sin(2 * np.pi * f * k * t + rng.uniform(0, 0.4)) * np.exp(-caida * t)
    y *= 1 + 0.06 * np.sin(2 * np.pi * 4.5 * t)
    ataque = np.minimum(1, t / 0.006)
    return y * ataque * vel * 0.22


def bajo(f, dur):
    t = np.arange(int(dur * SR)) / SR
    y = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    return y * np.exp(-1.7 * t) * np.minimum(1, t / 0.01) * 0.3


def bombo():
    t = np.arange(int(0.35 * SR)) / SR
    barrido = 130 * np.exp(-18 * t) + 42
    return np.sin(2 * np.pi * np.cumsum(barrido) / SR) * np.exp(-9 * t) * 0.65


def caja():
    t = np.arange(int(0.25 * SR)) / SR
    ruido = rng.standard_normal(len(t))
    b, a = signal.butter(2, [900 / (SR / 2), 7000 / (SR / 2)], "band")
    return (signal.lfilter(b, a, ruido) * np.exp(-18 * t) * 0.5 + np.sin(2 * np.pi * 185 * t) * np.exp(-22 * t) * 0.35) * 0.8


def hat(abierto=False):
    t = np.arange(int((0.18 if abierto else 0.05) * SR)) / SR
    b, a = signal.butter(2, 6500 / (SR / 2), "high")
    return signal.lfilter(b, a, rng.standard_normal(len(t))) * np.exp(-(14 if abierto else 55) * t) * 0.22


def melodia_nota(f, dur):
    t = np.arange(int(dur * SR)) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / 0.25)
    y = np.sin(2 * np.pi * f * t * vib) + 0.18 * np.sin(2 * np.pi * 2 * f * t * vib)
    return y * np.exp(-2.4 * t) * np.minimum(1, t / 0.02) * 0.2


# ---------- Componer ----------
compas = 0
for n_comp, con_bateria, con_melodia in SECCIONES:
    for c in range(n_comp):
        ac = ACORDES[compas % 4]
        t0 = compas * BAR
        # Acorde: golpe en el tiempo 1 y otro sincopado antes del tiempo 4
        for desfase, vel, dur in ((0.0, 1.0, BAR * 0.75), (BEAT * 2.75, 0.7, BAR * 0.35)):
            for j, m in enumerate(ac["notas"]):
                poner(mezcla, t0 + desfase + j * 0.018, piano(hz(m), dur, vel * rng.uniform(0.85, 1.0)), pan=0.35 + 0.1 * j)
        # Bajo
        poner(mezcla, t0, bajo(hz(ac["bajo"]), BEAT * 1.8), 0.5)
        poner(mezcla, t0 + BEAT * 2.5, bajo(hz(ac["bajo"] + (7 if c % 2 else 0)), BEAT * 1.2), 0.5, 0.85)
        # Batería con swing
        if con_bateria:
            poner(mezcla, t0, bombo(), 0.5)
            poner(mezcla, t0 + BEAT * 2.5, bombo(), 0.5, 0.8)
            poner(mezcla, t0 + BEAT * 1, caja(), 0.5)
            poner(mezcla, t0 + BEAT * 3, caja(), 0.5)
            for k in range(8):
                swing = 0.06 * BEAT if k % 2 else 0.0
                poner(mezcla, t0 + k * BEAT / 2 + swing, hat(abierto=(k == 7)), 0.62, rng.uniform(0.6, 1.0))
        # Melodía
        if con_melodia and c % 2 == 0:
            pos = sorted(rng.choice(np.arange(0, 8), size=int(rng.integers(3, 5)), replace=False))
            for p in pos:
                f = hz(int(rng.choice(PENTA)) + (0 if rng.random() > 0.2 else -12))
                poner(mezcla, t0 + p * BEAT / 2 + (0.05 * BEAT if p % 2 else 0), melodia_nota(f, BEAT * 2.2), 0.65, rng.uniform(0.7, 1.0))
        compas += 1

# Bucle: la cola vuelve a sonar al principio
mezcla[:, :COLA] += mezcla[:, N:N + COLA]
mezcla = mezcla[:, :N]

# ---------- Mezcla final (aire, calidez y vinilo) ----------
retraso = int(BEAT * 0.75 * SR)                       # eco suave
eco = np.zeros_like(mezcla)
eco[0, retraso:] = mezcla[1, :-retraso] * 0.28
eco[1, retraso:] = mezcla[0, :-retraso] * 0.28
mezcla = mezcla + eco

ir = rng.standard_normal(int(1.4 * SR)) * np.exp(-3.2 * np.arange(int(1.4 * SR)) / SR)
b, a = signal.butter(2, 3500 / (SR / 2), "low")
ir = signal.lfilter(b, a, ir)
for canal in (0, 1):
    mezcla[canal] += signal.fftconvolve(mezcla[canal], ir / np.sqrt(np.sum(ir ** 2)) * 0.12, mode="full")[:N]

b, a = signal.butter(2, 7500 / (SR / 2), "low")        # sonido cálido
b2, a2 = signal.butter(1, 40 / (SR / 2), "high")
mezcla = signal.lfilter(b2, a2, signal.lfilter(b, a, mezcla, axis=1), axis=1)

clics = (rng.random(N) > 0.9995) * rng.standard_normal(N) * 0.05            # crujido de vinilo suave
mezcla += np.vstack([clics, np.roll(clics, 97)])
mezcla *= 0.9 / np.max(np.abs(mezcla))
fade = int(0.02 * SR)
mezcla[:, :fade] *= np.linspace(0, 1, fade)
mezcla[:, -fade:] *= np.linspace(1, 0, fade)

# ---------- Guardar como MP3 ----------
destino = os.path.join(RAIZ, "audio", "musica-pokemon.mp3")
os.makedirs(os.path.dirname(destino), exist_ok=True)
with tempfile.TemporaryDirectory() as tmp:
    ruta = os.path.join(tmp, "m.wav")
    with wave.open(ruta, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mezcla.T * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", ruta, "-b:a", "96k", "-map_metadata", "-1",
                    "-metadata", "title=Pokedex lofi (original)", destino], check=True)
print("Creado {} ({:.0f} s, {:.1f} MB)".format(destino, N / SR, os.path.getsize(destino) / 1e6))
