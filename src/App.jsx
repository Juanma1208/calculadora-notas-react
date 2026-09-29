import { useState } from 'react';
import {
  calcularPromedio,
  calcularNotaNecesaria,
  estaAprobado,
  NOTA_APROBADO,
  NOTA_MAXIMA,
} from './utils/notas';

let siguienteId = 1;
const nuevaEvaluacion = (nombre = '', peso = '') => ({ id: siguienteId++, nombre, nota: '', peso });

const EVALUACIONES_INICIALES = [
  nuevaEvaluacion('Parcial 1', '30'),
  nuevaEvaluacion('Parcial 2', '30'),
  nuevaEvaluacion('Examen final', '40'),
];

function aNumero(valor) {
  return valor === '' ? null : Number(valor);
}

export default function App() {
  const [evaluaciones, setEvaluaciones] = useState(EVALUACIONES_INICIALES);
  const [notaAprobado, setNotaAprobado] = useState(String(NOTA_APROBADO));

  const actualizar = (id, campo, valor) =>
    setEvaluaciones((prev) => prev.map((e) => (e.id === id ? { ...e, [campo]: valor } : e)));

  const agregar = () => setEvaluaciones((prev) => [...prev, nuevaEvaluacion()]);

  const eliminar = (id) => setEvaluaciones((prev) => prev.filter((e) => e.id !== id));

  let resultado = null;
  let error = null;
  try {
    const datos = evaluaciones.map((e) => ({ nota: aNumero(e.nota), peso: Number(e.peso) }));
    const minimo = Number(notaAprobado);
    const promedio = calcularPromedio(datos);
    const necesaria = calcularNotaNecesaria(datos, minimo);
    resultado = {
      promedio,
      necesaria,
      aprobado: necesaria === null ? estaAprobado(promedio, minimo) : null,
    };
  } catch (e) {
    error = e.message;
  }

  return (
    <main className="calculadora">
      <h1>Calculadora de notas</h1>

      <table>
        <thead>
          <tr>
            <th>Evaluación</th>
            <th>Nota (0-{NOTA_MAXIMA})</th>
            <th>Peso (%)</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {evaluaciones.map((e, i) => (
            <tr key={e.id}>
              <td>
                <input
                  aria-label={`Nombre evaluación ${i + 1}`}
                  value={e.nombre}
                  onChange={(ev) => actualizar(e.id, 'nombre', ev.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max={NOTA_MAXIMA}
                  step="0.1"
                  placeholder="Pendiente"
                  aria-label={`Nota evaluación ${i + 1}`}
                  value={e.nota}
                  onChange={(ev) => actualizar(e.id, 'nota', ev.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  aria-label={`Peso evaluación ${i + 1}`}
                  value={e.peso}
                  onChange={(ev) => actualizar(e.id, 'peso', ev.target.value)}
                />
              </td>
              <td>
                <button
                  type="button"
                  aria-label={`Eliminar evaluación ${i + 1}`}
                  onClick={() => eliminar(e.id)}
                  disabled={evaluaciones.length === 1}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="acciones">
        <button type="button" onClick={agregar}>
          Añadir evaluación
        </button>
        <label>
          Nota para aprobar{' '}
          <input
            type="number"
            min="0"
            max={NOTA_MAXIMA}
            step="0.1"
            value={notaAprobado}
            onChange={(ev) => setNotaAprobado(ev.target.value)}
          />
        </label>
      </div>

      <section className="resultado" aria-live="polite">
        {error && <p className="error">{error}</p>}
        {resultado && (
          <>
            <p>
              Promedio actual:{' '}
              <strong data-testid="promedio">
                {resultado.promedio === null ? '—' : resultado.promedio}
              </strong>
            </p>
            {resultado.necesaria && (
              <p data-testid="necesaria">
                {resultado.necesaria.alcanzable
                  ? `Necesitas un ${resultado.necesaria.nota} en lo pendiente para aprobar.`
                  : `Necesitarías un ${resultado.necesaria.nota}: ya no es posible aprobar.`}
              </p>
            )}
            {resultado.aprobado !== null && (
              <p
                data-testid="estado"
                className={resultado.aprobado ? 'aprobado' : 'suspendido'}
              >
                {resultado.aprobado ? 'APROBADO' : 'SUSPENDIDO'}
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
