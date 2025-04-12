// Function to parse questions from text format
function parseQuestions(text) {
    return text.split('\n').map(line => {
        const [id, text, ...rest] = line.split('|');
        const options = rest.slice(0, -2); // Remove correct answer and explanation
        const correct = parseInt(rest[rest.length - 2]) - 1; // Convert to 0-based index
        const explanation = rest[rest.length - 1]; // Get the explanation
        
        return {
            id: parseInt(id),
            text,
            options,
            correct,
            explanation
        };
    });
}

// Function to fetch questions from file
async function fetchQuestions() {
    try {
        const response = await fetch('/backend/questions.txt');
        if (!response.ok) {
            throw new Error('Failed to load questions');
        }
        const text = await response.text();
        return parseQuestions(text);
    } catch (error) {
        console.error('Error loading questions:', error);
        return [];
    }
}

// Function to get random questions
async function getRandomQuestions(count = 5) {
    const questions = await fetchQuestions();
    if (questions.length === 0) return [];
    
    if (count > questions.length) count = questions.length;
    
    // Shuffle and return requested number of questions
    return [...questions]
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
}

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
        "text": "What is the time complexity of  heap sort ?",
        "options": ["O(log(n))", "O(n^2log(n))", "O(nlog(n))", "O(n)"],
        "correct": 2,
        "explanation": "Heap sort works in two main steps:\n1.Build the Heap (Max-Heap or Min-Heap)\nYou take the unsorted array and turn it into a heap.\nThis is done using the heapify method from the last non-leaf node up to the root.\nTime complexity: O(n) (not O(n log n), because lower levels need less work).\n\n2.Extract Elements One by OneRemove the root (max or min), place it at the end of the array.\nThen heapify-down to restore the heap property.\nYou do this n times, and each heapify takes O(log n) time.\nTime complexity: n * O(log n) = O(n log n)\n\n\nTotal Time:Build Heap: O(n)Extract Elements: O(n log n)Total = O(n + n log n) = O(n log n)"
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
        "explanation": "Dijkstra’s does not work with negative edge weights."
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

// Export for use in other files
window.questionsData = questionsData;

// Function to get questions from data
function getQuestionsFromData() {
    return window.questionsData;
}

// Function to get random questions from data
function getRandomQuestionsFromData(count = 15) {
    const questions = getQuestionsFromData();
    if (questions.length === 0) return [];
    
    if (count > questions.length) count = questions.length;
    
    // Shuffle and return requested number of questions
    return [...questions]
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
}

// Export for use in other files
window.getRandomQuestions = getRandomQuestions;
window.getRandomQuestionsFromData = getRandomQuestionsFromData;