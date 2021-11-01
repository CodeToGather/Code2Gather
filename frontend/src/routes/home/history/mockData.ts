import { Difficulty } from 'types/crud/difficulty';
import { Language } from 'types/crud/language';
import { MeetingRecord } from 'types/crud/meetingRecord';

export const mockMeetingRecords: MeetingRecord[] = [
  {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    intervieweeId: 'a',
    interviewerId: 'b',
    duration: 1000,
    questionId: 'abc',
    questionTitle: 'Two Sum',
    questionDifficulty: Difficulty.EASY,
    language: Language.PYTHON,
    codeWritten: `"""
    Given a binary tree root and an integer target, delete all the leaf nodes with value target.
    
    Note that once you delete a leaf node with value target, if it’s parent node becomes a leaf node and
    has the value target, it should also be deleted
    
    Treenode:
        val = value in node
        left = left child of node
        right = right child of node
        
    Post order traversal
    1. Call recurse(root)
        recurse(node)
        node is None:
        return None
        node.left = recurse(node.left)
        node.right = recurse(node.right)
        if left and right child both None and node’s value = target, return None, else node
    
          1
         /  
        2   3
    
    """
    
    def delete_leaves_with_given_value(root, target):
        def recurse(node):
            if node is None:
                return node
            node.left = recurse(node.left)
            node.right = recurse(node.right)
            if node.left is None and node.right is None and node.val = target:
                return None
            else:
                return node
        return recurse(root)
`,
    isSolved: true,
    feedbackToInterviewee: `Good that you read the question out loud.

Good that you decided to play around with the example to brainstorm the algorithm.

Very clear thought process as well, though perhaps it may have been better to articulate the process clearer.
- e.g. it’s quite vague to just say “there’s ‘b’ and ‘c’ here, so we can partition at the last ‘a’”. Explain why.

Very active discussion at the beginning, good!

I think the algorithm, though elaborate, can be more generalised. For example, step 1: should you only be finding the last index of the first element? What about the rest of the elements?
- Think about preprocessing steps.

I think for this question, since the coding is not very hard once you figure out the solution, it’s ok to spend more time on the algo design. But do be aware that you spent a bit too long on the algo designing step.
`,
  },
];
