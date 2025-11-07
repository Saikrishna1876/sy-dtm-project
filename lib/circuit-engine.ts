import { Node, Edge } from 'reactflow';
import { GateNodeData, SignalValue, GateType } from './types';

export function evaluateGate(type: GateType, inputs: SignalValue[]): SignalValue {
  const validInputs = inputs.filter(i => i !== null) as (0 | 1)[];

  if (validInputs.length === 0 || validInputs.length < inputs.length) {
    return null;
  }

  switch (type) {
    case 'AND':
      return validInputs.every(i => i === 1) ? 1 : 0;

    case 'OR':
      return validInputs.some(i => i === 1) ? 1 : 0;

    case 'NOT':
      return validInputs[0] === 1 ? 0 : 1;

    case 'NAND':
      return validInputs.every(i => i === 1) ? 0 : 1;

    case 'NOR':
      return validInputs.some(i => i === 1) ? 0 : 1;

    case 'XOR':
      return validInputs.filter(i => i === 1).length % 2 === 1 ? 1 : 0;

    case 'XNOR':
      return validInputs.filter(i => i === 1).length % 2 === 0 ? 1 : 0;

    case 'INPUT':
      return validInputs[0] ?? null;

    case 'OUTPUT':
      return validInputs[0] ?? null;

    default:
      return null;
  }
}

export function simulateCircuit(
  nodes: Node<GateNodeData>[],
  edges: Edge[]
): Map<string, SignalValue> {
  const nodeValues = new Map<string, SignalValue>();
  const nodeInputs = new Map<string, SignalValue[]>();
  const inDegree = new Map<string, number>();
  const adjacencyList = new Map<string, string[]>();

  nodes.forEach(node => {
    inDegree.set(node.id, 0);
    adjacencyList.set(node.id, []);

    if (node.data.type === 'INPUT') {
      nodeValues.set(node.id, node.data.value ?? 0);
    }
  });

  edges.forEach(edge => {
    const from = edge.source;
    const to = edge.target;

    if (!adjacencyList.has(from)) adjacencyList.set(from, []);
    adjacencyList.get(from)!.push(to);

    inDegree.set(to, (inDegree.get(to) || 0) + 1);
  });

  const queue: string[] = [];
  nodes.forEach(node => {
    if (node.data.type === 'INPUT') {
      queue.push(node.id);
    } else if (inDegree.get(node.id) === 0) {
      queue.push(node.id);
    }
  });

  const processed = new Set<string>();
  let iterations = 0;
  const maxIterations = nodes.length * 2;

  while (queue.length > 0 && iterations < maxIterations) {
    iterations++;
    const nodeId = queue.shift()!;

    if (processed.has(nodeId)) continue;

    const node = nodes.find(n => n.id === nodeId);
    if (!node) continue;

    if (node.data.type === 'INPUT') {
      nodeValues.set(nodeId, node.data.value ?? 0);
    } else {
      const inputEdges = edges.filter(e => e.target === nodeId);
      const inputs = inputEdges.map(e => nodeValues.get(e.source) ?? null);

      nodeInputs.set(nodeId, inputs);

      const output = evaluateGate(node.data.type, inputs);
      nodeValues.set(nodeId, output);
    }

    processed.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    neighbors.forEach(neighborId => {
      const neighbor = nodes.find(n => n.id === neighborId);
      if (!neighbor) return;

      const neighborInputEdges = edges.filter(e => e.target === neighborId);
      const allInputsReady = neighborInputEdges.every(e =>
        nodeValues.has(e.source)
      );

      if (allInputsReady && !processed.has(neighborId)) {
        queue.push(neighborId);
      }
    });
  }

  return nodeValues;
}

export function getEdgeColor(sourceId: string, nodeValues: Map<string, SignalValue>): string {
  const value = nodeValues.get(sourceId);

  if (value === 1) return '#22c55e';
  if (value === 0) return '#ef4444';
  return '#94a3b8';
}
