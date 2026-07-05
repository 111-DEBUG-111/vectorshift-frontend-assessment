from collections import deque
from typing import List, Optional, Tuple

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000', 'http://127.0.0.1:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class Node(BaseModel):
    id: str

    class Config:
        extra = 'allow'


class Edge(BaseModel):
    source: str
    target: str

    class Config:
        extra = 'allow'


class PipelineRequest(BaseModel):
    nodes: List[Node] = []
    edges: List[Edge] = []


def check_is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    node_ids = {node.id for node in nodes}

    adjacency = {node_id: [] for node_id in node_ids}
    in_degree = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        if edge.source not in node_ids or edge.target not in node_ids:
            continue
        adjacency[edge.source].append(edge.target)
        in_degree[edge.target] += 1

    queue = deque(node_id for node_id in node_ids if in_degree[node_id] == 0)
    visited_count = 0

    while queue:
        current = queue.popleft()
        visited_count += 1
        for neighbor in adjacency[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited_count == len(node_ids)


def find_components(nodes: List[Node], edges: List[Edge]) -> List[Tuple[List[Node], List[Edge]]]:
    parent = {node.id: node.id for node in nodes}

    def find(node_id: str) -> str:
        while parent[node_id] != node_id:
            parent[node_id] = parent[parent[node_id]]
            node_id = parent[node_id]
        return node_id

    def union(a: str, b: str) -> None:
        root_a, root_b = find(a), find(b)
        if root_a != root_b:
            parent[root_a] = root_b

    node_ids = set(parent.keys())
    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            union(edge.source, edge.target)

    order = []
    group_nodes = {}
    for node in nodes:
        root = find(node.id)
        if root not in group_nodes:
            order.append(root)
            group_nodes[root] = []
        group_nodes[root].append(node)

    group_edges = {root: [] for root in group_nodes}
    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            group_edges[find(edge.source)].append(edge)

    return [(group_nodes[root], group_edges[root]) for root in order]


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineRequest):
    components = find_components(pipeline.nodes, pipeline.edges)
    pipelines = [
        {
            'num_nodes': len(comp_nodes),
            'num_edges': len(comp_edges),
            'is_dag': check_is_dag(comp_nodes, comp_edges),
        }
        for comp_nodes, comp_edges in components
    ]

    return {
        'num_nodes': len(pipeline.nodes),
        'num_edges': len(pipeline.edges),
        'is_dag': all(p['is_dag'] for p in pipelines),
        'pipelines': pipelines,
    }
