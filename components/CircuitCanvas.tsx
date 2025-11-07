'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  EdgeProps,
  getBezierPath,
  BaseEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { GateNodeData, GateType, SignalValue, CircuitStats } from '@/lib/types';
import { simulateCircuit, getEdgeColor } from '@/lib/circuit-engine';
import LogicGateNode from './nodes/LogicGateNode';
import InputNode from './nodes/InputNode';
import OutputNode from './nodes/OutputNode';

const nodeTypes: NodeTypes = {
  logicGate: LogicGateNode,
  input: InputNode,
  output: OutputNode,
};

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        ...style,
        strokeWidth: 3,
        stroke: data?.color || '#94a3b8',
      }}
    />
  );
}

const edgeTypes = {
  custom: CustomEdge,
};

interface CircuitCanvasProps {
  onStatsChange?: (stats: CircuitStats) => void;
}

export default function CircuitCanvas({ onStatsChange }: CircuitCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const nodeIdCounter = useRef(0);

  const updateSimulation = useCallback(() => {
    const nodeValues = simulateCircuit(nodes, edges);

    setNodes((nds) =>
      nds.map((node) => {
        const value = nodeValues.get(node.id);
        return {
          ...node,
          data: {
            ...node.data,
            value: node.data.type === 'INPUT' ? node.data.value : value,
          },
        };
      })
    );

    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        type: 'custom',
        data: {
          color: getEdgeColor(edge.source, nodeValues),
        },
      }))
    );
  }, [nodes, edges, setNodes, setEdges]);

  useEffect(() => {
    updateSimulation();
  }, [nodes.length, edges.length]);

  useEffect(() => {
    if (onStatsChange) {
      const stats: CircuitStats = {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        inputCount: nodes.filter((n) => n.data.type === 'INPUT').length,
        outputCount: nodes.filter((n) => n.data.type === 'OUTPUT').length,
        gateCount: nodes.filter(
          (n) => !['INPUT', 'OUTPUT'].includes(n.data.type)
        ).length,
      };
      onStatsChange(stats);
    }
  }, [nodes, edges, onStatsChange]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'custom',
            animated: false,
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as GateType;

      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<GateNodeData> = {
        id: `node-${nodeIdCounter.current++}`,
        type: type === 'INPUT' ? 'input' : type === 'OUTPUT' ? 'output' : 'logicGate',
        position,
        data: {
          type,
          label: type,
          value: type === 'INPUT' ? 0 : null,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<GateNodeData>) => {
      if (node.data.type === 'INPUT') {
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              const newValue: SignalValue = n.data.value === 1 ? 0 : 1;
              return {
                ...n,
                data: {
                  ...n.data,
                  value: newValue,
                },
              };
            }
            return n;
          })
        );
      }
    },
    [setNodes]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSimulation();
    }, 10);
    return () => clearTimeout(timer);
  }, [nodes, updateSimulation]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
