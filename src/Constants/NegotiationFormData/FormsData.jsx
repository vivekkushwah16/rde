import image1 from "../../Assets/Images/NegotiationForm/Rectangle 503.png"
import image2 from "../../Assets/Images/NegotiationForm/Rectangle 504.png";
import image3 from "../../Assets/Images/NegotiationForm/Rectangle 505.png";
import image4 from "../../Assets/Images/NegotiationForm/Rectangle 506.png";
export const formsData = [
  {
    id: 1,
    question: "Which of the following fruits you like the most?",
    type: "SingleChoice",
    options: [
      {
        key: 1,
        option: "Apple",
      },
      {
        key: 2,
        option: "Pineapple",
      },
      {
        key: 3,
        option: "peach",
      },
      {
        key: 4,
        option: "cherry",
      },
      {
        key: 5,
        option: "Duriuan",
      },
      {
        key: 6,
        option: "Mango",
      },
      {
        key: 7,
        option: "Jackfruit",
      },
    ],
  },
  {
    id: 2,
    question: "Rate the below fruits based on your linkings",
    type: "Range",
    options: [
      {
        id: 1,
        option: "Apple",
      },
      {
        id: 2,
        option: "Pineapple",
      },
      {
        id: 3,
        option: "peach",
      },
      {
        id: 4,
        option: "cherry",
      },
    ],
  },
  {
    id: 3,
    question: "Rate the mango you just ate",
    type: "Rate",
  },
  {
    id: 4,
    question: "Choose the image that has a mango.",
    type: "pictureChoice",
    options: [
      {
        key: 1,
        image: image1,
        option: "apple",
      },
      {
        key: 2,
        image: image2,
        option: "Pineapple",
      },
      {
        key: 3,
        image: image3,
        option: "mango",
      },
      {
        key: 4,
        image: image4,
        option: "Kiwi",
      },
    ],
  },
  {
    id: 5,
    question: "Which dimensions shape real negotiation scenarios?",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option:
          "Time​",
      },
      {
        key: 2,
        option:
          "Team",
      },
      {
        key: 3,
        option: "Analysis",
      },
      {
        key: 4,
        option: "Outcome​",
      },
      {
        key: 5,
        option: "All of these",
      },
    ],
  },
];
export const formsData2 = [
  {
    id: 1,
    question:
      "What types of stakeholders should you be prepared to address in a typical negotiation?",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "HTA Bodies",
      },
      {
        key: 2,
        option: "Patients",
      },
      {
        key: 3,
        option: "Provider Organizations",
      },
      {
        key: 4,
        option: "Medical Community",
      },
      {
        key: 5,
        option: "Political Influencer",
      },
      {
        key: 6,
        option: "Media",
      },
      {
        key: 7,
        option: "Public",
      },
    ],
    correct:[1,2,3,4,5,6,7]
  },
  {
    id: 2,
    question: "The starting point of the negotiation:",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "Can be quite low",
      },
      {
        key: 2,
        option: "Should be credibly justified",
      },
      {
        key: 3,
        option: "Cannot be too high",
      },
      {
        key: 4,
        option: "Should account for anticipated outcomes of HTA evaluation",
      },
    ],
    correct:[2,3,4]
  },
  {
    id: 3,
    question: "The guide posts:",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option:
          "Refer to different concessions we would be prepared to negotiate on ",
      },
      {
        key: 2,
        option: "Depend on the Payer’s objection",
      },
      {
        key: 3,
        option: "Are relevant across all phases",
      },
      {
        key: 4,
        option: "Depend on the clear rationale for any concessions planned",
      },
    ],
    correct:[1,2,4]
  },
  {
    id: 4,
    question:
      "A large concession down to the lower end or below the target price range should only be given if it provides significant improvement of:",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "Access",
      },
      {
        key: 2,
        option: "Time to market ",
      },
      {
        key: 3,
        option: "Volume share",
      },
      {
        key: 4,
        option: "All of the above",
      },
    ],
    correct:[1,2,3,4]

  },
  {
    id: 5,
    question:
      "Which types of negotiation focus on additional value for both sellers and buyers?",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "Concession trading",
      },
      {
        key: 2,
        option: "Win-win",
      },
      {
        key: 3,
        option: "Dealing",
      },
      {
        key: 4,
        option: "Hard bargaining",
      },

      {
        key: 5,
        option: "Relationship building ",
      },
      {
        key: 6,
        option: "Haggling/ bidding ",
      },
      {
        key: 7,
        option: "Bartering",
      },
      {
        key: 8,
        option: "Partnership/ joint problem solving",
      },
    ],
    correct:[2,8]

  },

  {
    id: 6,
    question: "Payers need to be able to “sell” the outcome of a negotiation to their superiors",
    type: "SingleChoice",
    options: [
      {
        key: 1,
        option: "True",
      },
      {
        key: 2,
        option: "False",
      },
    ],
    correct:[1]

  },
];



// ---------------------------------------From 2---------------------------------------



export const formsData1 = [
  {
    id: 1,
    question: "Which dimensions shape real negotiation scenarios?",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "Time​",
      },
      {
        key: 2,
        option: "Team",
      },
      {
        key: 3,
        option: "Analysis",
      },
      {
        key: 4,
        option: "Outcome​",
      },
      {
        key: 5,
        option: "All of these",
      },
    ],
    correct:[1,2,4]

  },
  {
    id: 2,
    question: "What are the two types of customers we engage with today?",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "Strategic and transactional",
      },
      {
        key: 2,
        option: "Big and small",
      },
      {
        key: 3,
        option: "International and domestic",
      },
    ],
    correct:[1]

  },
  {
    id: 3,
    question: "Which of the following approaches to strategic customers value:",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "Advice",
      },
      {
        key: 2,
        option: "Convenience",
      },
      {
        key: 3,
        option: "Meetings",
      },
      {
        key: 4,
        option: " Lower Costs",
      },
      {
        key: 5,
        option: "Expertise",
      },
    ],
    correct:[1,3,5,]

  },
  {
    id: 4,
    question: "What does BATNA stand for?",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "Best Agreement to Negotiated Arbitration",
      },
      {
        key: 2,
        option: "Best Anchor in Transactional Negotiation Alternatives",
      },
      {
        key: 3,
        option: "Best Alternative to a Negotiated Agreement",
      },
    ],
    correct:[3]

  },
  {
    id: 5,
    question: "What forms the zone of possible agreement?",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "A combination of the seller’s and buyer’s best alternative",
      },
      {
        key: 2,
        option:
          " A combination of the buyer’s maximum willingness to pay and the seller’s best alternative",
      },
      {
        key: 3,
        option:
          "A combination of the minimum seller’s price and the buyer’s reservation value",
      },
      {
        key: 4,
        option: "None of the above ",
      },
    ],
    correct:[4]

  },
  {
    id: 6,
    question: "What is the APACT framework?",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "Answer, Pacify, Acknowledge, Close, Talk",
      },
      {
        key: 2,
        option: "Abbreviate, Close, Address, Confirm, Thrive",
      },
      {
        key: 3,
        option: "Acknowledge, Probe, Answer, Confirm , Transition ",
      },
    ],
    correct:[3]

  },
  {
    id: 7,
    question:
      "What are the key differences between strategic and transactional customers?",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "Decision making criteria",
      },
      {
        key: 2,
        option: "Focus",
      },
      {
        key: 3,
        option: "Time they want to invest ",
      },
      {
        key: 4,
        option: " Outcome",
      },
      {
        key: 5,
        option: "All of the above",
      },
    ],
    correct:[1,2,3]

  },
  {
    id: 8,
    question: "The process of pre-suasion is about the other party’s receptiveness to a message before they encounter it ",
    type: "SingleChoice",
    options: [
      {
        key: 1,
        option: "True",
      },
      {
        key: 2,
        option: "False",
      },
    ],
    correct:[1]

  },
];


// -------------------------------------------------------form 3----------------------------------------



export const formsData3 = [
  {
    id: 1,
    question: "There are 6 steps associated with pre-negotiation planning",
    type: "SingleChoice",
    options: [
      {
        key: 1,
        option: "True",
      },
      {
        key: 2,
        option: "False",
      },
    ],
    correct:[1]
  },
  {
    id: 2,
    question:
      "The pyramid principle dictates that we should follow a bottom up messaging approach ",
    type: "SingleChoice",
    options: [
      {
        key: 1,
        option: "True",
      },
      {
        key: 2,
        option: "False",
      },
    ],
    correct:[2]
  },
  {
    id: 3,
    question:
      "Our value story should be tailored to the stakeholders needs and motivations identified in our stakeholder map",
    type: "SingleChoice",
    options: [
      {
        key: 1,
        option: "True",
      },
      {
        key: 2,
        option: "False",
      },
    ],
    correct:[1]
  },
  {
    id: 4,
    question:
      "A false exaggeration type of objections shows interest from the payer",
    type: "SingleChoice",
    options: [
      {
        key: 1,
        option: "True",
      },
      {
        key: 2,
        option: "False",
      },
    ],
    correct:[1]
  },
  {
    id: 5,
    question:
      "When a payer raises a drawback type of objection you should provide evidence to refute the claim ",
    type: "SingleChoice",
    options: [
      {
        key: 1,
        option: "True",
      },
      {
        key: 2,
        option: "False",
      },
    ],
    correct:[1]
  },
  {
    id: 6,
    question:
      "What type of objection is the following statement ‘I would like to know more about the clinical profile of Product X’",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "False, exaggeration or reality",
      },
      {
        key: 2,
        option: "Request for Information",
      },
      {
        key: 3,
        option: "Misunderstanding",
      },
      {
        key: 4,
        option: "Drawback",
      },
      {
        key: 5,
        option: "None of the above",
      },
    ],
    correct:[2]
  },
  {
    id: 7,
    question:
      "What type of objection is the following statement ‘Product X is the most expensive product in the world’",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "False, exaggeration or reality",
      },
      {
        key: 2,
        option: "Request for Information",
      },
      {
        key: 3,
        option: "Misunderstanding",
      },
      {
        key: 4,
        option: "Drawback",
      },
      {
        key: 5,
        option: "None of the above",
      },
    ],
    correct:[1]
  },
  {
    id: 8,
    question:
      "An open question should be used to close and transition an objection",
    type: "SingleChoice",
    options: [
      {
        key: 1,
        option: "True",
      },
      {
        key: 2,
        option: "False",
      },
    ],
    correct:[2]
  },
  {
    id: 9,
    question:
      "Higher degrees of which dimensions help build trust with our customers",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "Credibility",
      },
      {
        key: 2,
        option: "Reliability",
      },
      {
        key: 3,
        option: "Self-Orientation",
      },
      {
        key: 4,
        option: "Intimacy",
      },
    ],
    correct:[1,2,4]
  },
  {
    id: 10,
    question:
      "The optimal and most persuasive number of messages is _____ . (Complete the phrase)",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "One",
      },
      {
        key: 2,
        option: "Two",
      },
      {
        key: 3,
        option: "Three",
      },
      {
        key: 4,
        option: "Four",
      },
    ],
    correct:[3]
  },
  {
    id: 11,
    question: "Which of the following statements are true?",
    type: "multiChoice",
    options: [
      {
        key: 1,
        option: "Expenditures in buyers resources are all valued equally",
      },
      {
        key: 2,
        option: "Payers use accounts (budgets) to group resources",
      },
      {
        key: 3,
        option: "Losses for the payer in a negotiation should be separated ",
      },
      {
        key: 4,
        option: "Gains offered in the negotiation should be integrated",
      },
    ],
    correct:[2]
  },
 
];
