// Teste dourado (golden): fixa a saída de permutacaoAlternativas e a reversão,
// garantindo que a correção usa a MESMA permutação do exam-app.
// Rode: npx tsx scripts/corrigir-fase1.logic.spec.ts
import { permutacaoAlternativas } from "../../../exam/api/src/prova/shuffle.js";
import { letraCanonica, estaCorreta, calcularNota } from "./corrigir-fase1.logic.js";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`FALHOU: ${msg}`);
}

// 1) A permutação é estável e bate com o exam-app.
assert(
  JSON.stringify(permutacaoAlternativas("i1:q1")) === JSON.stringify(["C", "E", "D", "B", "A"]),
  `permutacaoAlternativas("i1:q1")`,
);
assert(
  JSON.stringify(permutacaoAlternativas("i1:q2")) === JSON.stringify(["D", "B", "A", "C", "E"]),
  `permutacaoAlternativas("i1:q2")`,
);
assert(
  JSON.stringify(permutacaoAlternativas("i2:q1")) === JSON.stringify(["E", "B", "A", "D", "C"]),
  `permutacaoAlternativas("i2:q1")`,
);

// 2) Reversão: a letra exibida vira a canônica (perm de "i1:q1" = C,E,D,B,A).
assert(letraCanonica("i1", "q1", "A") === "C", "exibida A → canônica C");
assert(letraCanonica("i1", "q1", "B") === "E", "exibida B → canônica E");
assert(letraCanonica("i1", "q1", "C") === "D", "exibida C → canônica D");
assert(letraCanonica("i1", "q1", "Z") === null, "letra inválida → null");

// 3) estaCorreta só é true quando a canônica da resposta bate com a correta.
assert(estaCorreta("i1", "q1", "A", "C") === true, "correta");
assert(estaCorreta("i1", "q1", "B", "C") === false, "incorreta");
assert(estaCorreta("i1", "q1", "A", null) === false, "sem gabarito nunca é correta");

// 4) Nota com 2 casas, idêntica a finalizarProva (Math.round(nota*100)/100).
assert(calcularNota(3, 20) === 15, "3/20 = 15");
assert(calcularNota(1, 3) === 33.33, "1/3 = 33.33");
assert(calcularNota(0, 0) === 0, "0 questões = 0");

console.log("OK: permutação, reversão e nota conferem com o exam-app.");
