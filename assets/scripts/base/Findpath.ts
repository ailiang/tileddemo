export interface GridCell {
    x: number;
    y: number;
    passable: boolean;
}

export interface PathfindingResult {
    path: GridCell[];
    found: boolean;
}

export class FindPath {
    private grid: GridCell[][];

    constructor(grid: GridCell[][]) {
        this.grid = grid;
    }

    public findPath(start: GridCell, end: GridCell): PathfindingResult {
        const openList: GridCell[] = [];
        const closedList: GridCell[] = [];
        const cameFrom: { [key: string]: GridCell } = {};

        const heuristic = (cell: GridCell) => {
            return Math.abs(cell.x - end.x) + Math.abs(cell.y - end.y);
        };

        const cost = (cell: GridCell) => {
            return 1;
        };

        openList.push(start);

        while (openList.length > 0) {
            let current: GridCell = openList[0];
            let currentIndex = 0;
            for (let i = 1; i < openList.length; i++) {
                if (heuristic(openList[i]) < heuristic(current)) {
                    current = openList[i];
                    currentIndex = i;
                }
            }

            openList.splice(currentIndex, 1);
            closedList.push(current);

            if (current.x === end.x && current.y === end.y) {
                const path: GridCell[] = [];
                while (current) {
                    path.push(current);
                    current = cameFrom[`${current.x},${current.y}`];
                }
                return { path: path.reverse(), found: true };
            }

            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                if (closedList.find((cell) => cell.x === neighbor.x && cell.y === neighbor.y)) {
                    continue;
                }

                const tentativeGScore = cost(current) + 1;
                if (!openList.find((cell) => cell.x === neighbor.x && cell.y === neighbor.y)) {
                    openList.push(neighbor);
                } else if (tentativeGScore >= cost(neighbor)) {
                    continue;
                }

                cameFrom[`${neighbor.x},${neighbor.y}`] = current;
            }
        }

        return { path: [], found: false };
    }

    private getNeighbors(cell: GridCell): GridCell[] {
        const neighbors: GridCell[] = [];
        const directions = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ];

        for (const direction of directions) {
            const x = cell.x + direction[0];
            const y = cell.y + direction[1];

            if (x >= 0 && x < this.grid.length && y >= 0 && y < this.grid[0].length) {
                const neighbor = this.grid[x][y];
                if (neighbor.passable) {
                    neighbors.push(neighbor);
                }
            }
        }

        return neighbors;
    }
} 
