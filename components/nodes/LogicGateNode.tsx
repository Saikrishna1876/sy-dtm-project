'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { GateNodeData } from '@/lib/types';
import { Zap } from 'lucide-react';

interface LogicGateNodeProps {
  data: GateNodeData;
  id: string;
}

const LogicGateNode = memo(({ data }: LogicGateNodeProps) => {
  const inputCount = ['NOT'].includes(data.type) ? 1 : 2;

  const getGateSymbol = () => {
    switch (data.type) {
      case 'AND':
        return 'AND';
      case 'OR':
        return 'OR';
      case 'NOT':
        return 'NOT';
      case 'NAND':
        return 'NAND';
      case 'NOR':
        return 'NOR';
      case 'XOR':
        return 'XOR';
      case 'XNOR':
        return 'XNOR';
      default:
        return data.type;
    }
  };

  return (
    <div className="bg-white border-2 border-blue-500 rounded-lg shadow-lg min-w-[120px]">
      <div className="px-4 py-3 flex items-center justify-center gap-2">
        <Zap className="w-4 h-4 text-blue-600" />
        <span className="font-bold text-sm text-blue-900">{getGateSymbol()}</span>
      </div>

      {Array.from({ length: inputCount }).map((_, i) => (
        <Handle
          key={`input-${i}`}
          type="target"
          position={Position.Left}
          id={`input-${i}`}
          style={{
            top: inputCount === 1 ? '50%' : `${((i + 1) / (inputCount + 1)) * 100}%`,
            background: '#3b82f6',
            width: '12px',
            height: '12px',
            border: '2px solid white',
          }}
        />
      ))}

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          top: '50%',
          background: '#3b82f6',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
    </div>
  );
});

LogicGateNode.displayName = 'LogicGateNode';

export default LogicGateNode;
