import { describe, it, expect } from 'vitest';
import {
  esNotaValida,
  calcularPromedio,
  calcularNotaNecesaria,
  estaAprobado,
} from './notas';

describe('esNotaValida', () => {
  it('acepta notas dentro del rango 0-10', () => {
    expect(esNotaValida(0)).toBe(true);
    expect(esNotaValida(5.5)).toBe(true);
    expect(esNotaValida(10)).toBe(true);
  });

  it('rechaza notas fuera de rango o que no son números', () => {
    expect(esNotaValida(-1)).toBe(false);
    expect(esNotaValida(10.1)).toBe(false);
    expect(esNotaValida('7')).toBe(false);
    expect(esNotaValida(NaN)).toBe(false);
    expect(esNotaValida(Infinity)).toBe(false);
  });
});

describe('calcularPromedio', () => {
  it('calcula el promedio simple cuando todos los pesos son iguales', () => {
    const evaluaciones = [
      { nota: 4, peso: 1 },
      { nota: 6, peso: 1 },
      { nota: 8, peso: 1 },
    ];
    expect(calcularPromedio(evaluaciones)).toBe(6);
  });

  it('calcula el promedio ponderado', () => {
    const evaluaciones = [
      { nota: 10, peso: 30 },
      { nota: 5, peso: 70 },
    ];
    expect(calcularPromedio(evaluaciones)).toBe(6.5);
  });

  it('ignora las evaluaciones pendientes', () => {
    const evaluaciones = [
      { nota: 8, peso: 40 },
      { nota: null, peso: 60 },
    ];
    expect(calcularPromedio(evaluaciones)).toBe(8);
  });

  it('redondea a dos decimales', () => {
    const evaluaciones = [
      { nota: 7, peso: 1 },
      { nota: 7, peso: 1 },
      { nota: 8, peso: 1 },
    ];
    expect(calcularPromedio(evaluaciones)).toBe(7.33);
  });

  it('devuelve null si no hay notas', () => {
    expect(calcularPromedio([])).toBeNull();
    expect(calcularPromedio([{ nota: null, peso: 100 }])).toBeNull();
  });

  it('lanza error con datos inválidos', () => {
    expect(() => calcularPromedio(null)).toThrow(TypeError);
    expect(() => calcularPromedio([{ nota: 11, peso: 1 }])).toThrow(RangeError);
    expect(() => calcularPromedio([{ nota: 5, peso: 0 }])).toThrow(RangeError);
  });
});

describe('calcularNotaNecesaria', () => {
  it('calcula la nota necesaria en la evaluación pendiente', () => {
    const evaluaciones = [
      { nota: 4, peso: 50 },
      { nota: null, peso: 50 },
    ];
    expect(calcularNotaNecesaria(evaluaciones)).toEqual({ nota: 6, alcanzable: true });
  });

  it('reparte la nota necesaria entre varias evaluaciones pendientes', () => {
    const evaluaciones = [
      { nota: 3, peso: 40 },
      { nota: null, peso: 30 },
      { nota: null, peso: 30 },
    ];
    // (5 * 100 - 3 * 40) / 60 = 6.33
    expect(calcularNotaNecesaria(evaluaciones)).toEqual({ nota: 6.33, alcanzable: true });
  });

  it('devuelve 0 si ya está aprobado sin importar lo pendiente', () => {
    const evaluaciones = [
      { nota: 10, peso: 80 },
      { nota: null, peso: 20 },
    ];
    expect(calcularNotaNecesaria(evaluaciones)).toEqual({ nota: 0, alcanzable: true });
  });

  it('indica cuando la nota necesaria no es alcanzable', () => {
    const evaluaciones = [
      { nota: 1, peso: 80 },
      { nota: null, peso: 20 },
    ];
    expect(calcularNotaNecesaria(evaluaciones)).toEqual({ nota: 21, alcanzable: false });
  });

  it('permite configurar la nota de aprobado', () => {
    const evaluaciones = [
      { nota: 6, peso: 50 },
      { nota: null, peso: 50 },
    ];
    expect(calcularNotaNecesaria(evaluaciones, 7)).toEqual({ nota: 8, alcanzable: true });
  });

  it('devuelve null si no quedan evaluaciones pendientes', () => {
    expect(calcularNotaNecesaria([{ nota: 5, peso: 100 }])).toBeNull();
  });
});

describe('estaAprobado', () => {
  it('aprueba con 5 o más', () => {
    expect(estaAprobado(5)).toBe(true);
    expect(estaAprobado(9.5)).toBe(true);
  });

  it('suspende con menos de 5', () => {
    expect(estaAprobado(4.99)).toBe(false);
    expect(estaAprobado(0)).toBe(false);
  });

  it('respeta una nota de aprobado personalizada', () => {
    expect(estaAprobado(6, 7)).toBe(false);
    expect(estaAprobado(7, 7)).toBe(true);
  });

  it('devuelve false si no hay promedio', () => {
    expect(estaAprobado(null)).toBe(false);
  });

  it('lanza error con un promedio inválido', () => {
    expect(() => estaAprobado(15)).toThrow(RangeError);
  });
});
