export type SignalValue = 0 | 1 | null;

export type GateType =
  | 'AND'
  | 'OR'
  | 'NOT'
  | 'NAND'
  | 'NOR'
  | 'XOR'
  | 'XNOR'
  | 'INPUT'
  | 'OUTPUT';

export interface GateNodeData {
  type: GateType;
  label: string;
  value?: SignalValue;
  inputs?: SignalValue[];
  output?: SignalValue;
}

export interface CircuitStats {
  nodeCount: number;
  edgeCount: number;
  inputCount: number;
  outputCount: number;
  gateCount: number;
}
