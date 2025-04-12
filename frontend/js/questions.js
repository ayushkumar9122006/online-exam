// Questions database
const questionsData = [
    {
        "id": 1,
        "text": "Which traversal gives sorted output in a Binary Search Tree?",
        "options": ["Preorder", "Inorder", "Postorder", "Level-order"],
        "correct": 1,
        "explanation": "Inorder traversal of a BST visits nodes in ascending order."
    },
    {
        "id": 2,
        "text": "In a circular linked list, which node links to the head?",
        "options": ["Last node", "Middle node", "Head", "Random node"],
        "correct": 0,
        "explanation": "In a circular linked list, the last node points back to the head."
    },
    {
        "id": 3,
        "text": "What happens when stack overflows?",
        "options": ["Memory error", "Restart", "Segmentation fault", "Corrupted pointer"],
        "correct": 2,
        "explanation": "Stack overflow can lead to segmentation faults in C."
    },
    {
        "id": 4,
        "text": "Which of the following trees has minimum height for n keys?",
        "options": ["Binary Search Tree", "AVL Tree", "B+ Tree", "Splay Tree"],
        "correct": 2,
        "explanation": "B+ Tree has multiple children per node, reducing height significantly."
    },
    {
        "id": 5,
        "text": "Which rotation is used in right-left imbalance of AVL Tree?",
        "options": ["Left Rotation", "Right Rotation", "Left-Right", "Right-Left"],
        "correct": 3,
        "explanation": "Right-Left rotation is used to fix right-left imbalance in AVL."
    },
    {
        "id": 6,
        "text": "What is the time complexity of heap sort?",
        "options": ["O(log(n))", "O(n^2log(n))", "O(nlog(n))", "O(n)"],
        "correct": 2,
        "explanation": "Heap sort has O(nlog(n)) time complexity due to heapify operations."
    },
    {
        "id": 7,
        "text": "Which operation is most costly in a splay tree?",
        "options": ["Insert", "Search", "Splay", "Delete"],
        "correct": 3,
        "explanation": "Delete requires splaying and restructuring, making it costly."
    },
    {
        "id": 8,
        "text": "Which node is always accessed last in BFS?",
        "options": ["Root", "Leaf", "Farthest node", "Middle node"],
        "correct": 2,
        "explanation": "BFS ends at the farthest reachable node from the start."
    },
    {
        "id": 9,
        "text": "Dijkstra's algorithm fails with which type of weights?",
        "options": ["Zero", "Positive", "Negative", "Mixed"],
        "correct": 2,
        "explanation": "Dijkstra's does not work with negative edge weights."
    },
    {
        "id": 10,
        "text": "What is time complexity of merging two binomial heaps?",
        "options": ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
        "correct": 0,
        "explanation": "Merging two binomial heaps takes O(log n) time."
    },
    {
        "id": 11,
        "text": "What is the space complexity of adjacency matrix for n vertices?",
        "options": ["O(n)", "O(n^2)", "O(log n)", "O(n log n)"],
        "correct": 1,
        "explanation": "Adjacency matrix requires O(n^2) space."
    },
    {
        "id": 12,
        "text": "What condition causes queue underflow?",
        "options": ["rear == front", "front == NULL", "Empty array", "front > rear"],
        "correct": 1,
        "explanation": "If front is NULL (or invalid), the queue is empty — underflow."
    },
    {
        "id": 13,
        "text": "Which tree guarantees O(log n) insert/search/delete?",
        "options": ["BST", "Splay Tree", "AVL Tree", "Heap"],
        "correct": 2,
        "explanation": "AVL Tree is strictly balanced and guarantees O(log n) operations."
    },
    {
        "id": 14,
        "text": "Which node in a max heap has no children?",
        "options": ["Root", "First node", "Middle node", "Leaf"],
        "correct": 3,
        "explanation": "Leaves in a max heap do not have any children."
    },
    {
        "id": 15,
        "text": "What is the branching factor of a B-Tree of order m?",
        "options": ["m", "m+1", "m-1", "⌈m/2⌉"],
        "correct": 0,
        "explanation": "A B-tree of order m can have up to m children."
    }
];

// Make questions available globally
window.questionsData = questionsData;