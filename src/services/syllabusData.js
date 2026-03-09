export const getSyllabusByBranch = (branch) => {
  const syllabi = {
    ECE: {
      subjects: [
        {
          name: "Signals and Systems",
          priority: "high",
          topics: [
            {
              name: "Continuous Time Signals",
              subtopics: [
                { name: "Basic Signals", completed: false },
                { name: "Signal Operations", completed: false },
                { name: "Signal Properties", completed: false }
              ],
              completed: false
            },
            {
              name: "Discrete Time Signals",
              subtopics: [
                { name: "DT Signals Basics", completed: false },
                { name: "Sampling", completed: false },
                { name: "Quantization", completed: false }
              ],
              completed: false
            },
            {
              name: "LTI Systems",
              subtopics: [
                { name: "Impulse Response", completed: false },
                { name: "Convolution", completed: false },
                { name: "Properties", completed: false }
              ],
              completed: false
            },
            {
              name: "Fourier Series",
              subtopics: [
                { name: "Trigonometric FS", completed: false },
                { name: "Exponential FS", completed: false },
                { name: "Convergence", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Network Theory",
          priority: "high",
          topics: [
            {
              name: "Network Theorems",
              subtopics: [
                { name: "Thevenin", completed: false },
                { name: "Norton", completed: false },
                { name: "Superposition", completed: false },
                { name: "Maximum Power Transfer", completed: false }
              ],
              completed: false
            },
            {
              name: "Transient Analysis",
              subtopics: [
                { name: "RC Circuits", completed: false },
                { name: "RL Circuits", completed: false },
                { name: "RLC Circuits", completed: false }
              ],
              completed: false
            },
            {
              name: "AC Analysis",
              subtopics: [
                { name: "Phasors", completed: false },
                { name: "Impedance", completed: false },
                { name: "Resonance", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Electronic Devices",
          priority: "high",
          topics: [
            {
              name: "Semiconductor Physics",
              subtopics: [
                { name: "Energy Bands", completed: false },
                { name: "Carrier Concentration", completed: false },
                { name: "Drift and Diffusion", completed: false }
              ],
              completed: false
            },
            {
              name: "Diodes",
              subtopics: [
                { name: "PN Junction", completed: false },
                { name: "Zener Diode", completed: false },
                { name: "Applications", completed: false }
              ],
              completed: false
            },
            {
              name: "Transistors",
              subtopics: [
                { name: "BJT Characteristics", completed: false },
                { name: "FET Characteristics", completed: false },
                { name: "MOSFET", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Analog Circuits",
          priority: "high",
          topics: [
            {
              name: "Amplifiers",
              subtopics: [
                { name: "BJT Amplifiers", completed: false },
                { name: "FET Amplifiers", completed: false },
                { name: "Multistage", completed: false }
              ],
              completed: false
            },
            {
              name: "Op-Amps",
              subtopics: [
                { name: "Ideal Op-Amp", completed: false },
                { name: "Inverting/Non-inverting", completed: false },
                { name: "Applications", completed: false }
              ],
              completed: false
            },
            {
              name: "Oscillators",
              subtopics: [
                { name: "RC Oscillators", completed: false },
                { name: "LC Oscillators", completed: false },
                { name: "Crystal Oscillators", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Digital Circuits",
          priority: "high",
          topics: [
            {
              name: "Boolean Algebra",
              subtopics: [
                { name: "Logic Gates", completed: false },
                { name: "K-Maps", completed: false },
                { name: "Quine-McCluskey", completed: false }
              ],
              completed: false
            },
            {
              name: "Combinational Circuits",
              subtopics: [
                { name: "Adders/Subtractors", completed: false },
                { name: "Multiplexers", completed: false },
                { name: "Decoders", completed: false }
              ],
              completed: false
            },
            {
              name: "Sequential Circuits",
              subtopics: [
                { name: "Flip-Flops", completed: false },
                { name: "Counters", completed: false },
                { name: "Registers", completed: false }
              ],
              completed: false
            },
            {
              name: "Memory",
              subtopics: [
                { name: "ROM/RAM", completed: false },
                { name: "PLDs", completed: false },
                { name: "FPGA Basics", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Communications",
          priority: "medium",
          topics: [
            {
              name: "Analog Communication",
              subtopics: [
                { name: "AM/FM", completed: false },
                { name: "Modulators", completed: false },
                { name: "Demodulators", completed: false }
              ],
              completed: false
            },
            {
              name: "Digital Communication",
              subtopics: [
                { name: "PCM/DPCM", completed: false },
                { name: "ASK/FSK/PSK", completed: false },
                { name: "QPSK", completed: false }
              ],
              completed: false
            },
            {
              name: "Information Theory",
              subtopics: [
                { name: "Entropy", completed: false },
                { name: "Source Coding", completed: false },
                { name: "Channel Capacity", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Electromagnetics",
          priority: "medium",
          topics: [
            {
              name: "Vector Analysis",
              subtopics: [
                { name: "Coordinate Systems", completed: false },
                { name: "Gradient/Div/Curl", completed: false },
                { name: "Integrals", completed: false }
              ],
              completed: false
            },
            {
              name: "Maxwell's Equations",
              subtopics: [
                { name: "Gauss Law", completed: false },
                { name: "Faraday Law", completed: false },
                { name: "Ampere Law", completed: false }
              ],
              completed: false
            },
            {
              name: "Wave Propagation",
              subtopics: [
                { name: "Plane Waves", completed: false },
                { name: "Polarization", completed: false },
                { name: "Reflection/Refraction", completed: false }
              ],
              completed: false
            },
            {
              name: "Transmission Lines",
              subtopics: [
                { name: "Line Parameters", completed: false },
                { name: "Smith Chart", completed: false },
                { name: "Impedance Matching", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Control Systems",
          priority: "medium",
          topics: [
            {
              name: "Block Diagrams",
              subtopics: [
                { name: "Transfer Function", completed: false },
                { name: "Signal Flow Graph", completed: false },
                { name: "Mason's Gain", completed: false }
              ],
              completed: false
            },
            {
              name: "Time Response",
              subtopics: [
                { name: "First Order", completed: false },
                { name: "Second Order", completed: false },
                { name: "Steady State Error", completed: false }
              ],
              completed: false
            },
            {
              name: "Stability",
              subtopics: [
                { name: "Routh Array", completed: false },
                { name: "Root Locus", completed: false },
                { name: "Nyquist", completed: false }
              ],
              completed: false
            },
            {
              name: "Frequency Response",
              subtopics: [
                { name: "Bode Plots", completed: false },
                { name: "Gain/Phase Margins", completed: false },
                { name: "Nichols Chart", completed: false }
              ],
              completed: false
            }
          ]
        }
      ]
    },
    EE: {
      subjects: [
        {
          name: "Electrical Machines",
          priority: "high",
          topics: [
            {
              name: "Transformers",
              subtopics: [
                { name: "Ideal Transformer", completed: false },
                { name: "Equivalent Circuit", completed: false },
                { name: "Testing", completed: false }
              ],
              completed: false
            },
            {
              name: "DC Machines",
              subtopics: [
                { name: "Construction", completed: false },
                { name: "Characteristics", completed: false },
                { name: "Starting/Speed Control", completed: false }
              ],
              completed: false
            },
            {
              name: "Induction Motors",
              subtopics: [
                { name: "3-Phase IM", completed: false },
                { name: "Torque-Slip", completed: false },
                { name: "Starting Methods", completed: false }
              ],
              completed: false
            },
            {
              name: "Synchronous Machines",
              subtopics: [
                { name: "Alternators", completed: false },
                { name: "Synchronous Motors", completed: false },
                { name: "Parallel Operation", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Power Systems",
          priority: "high",
          topics: [
            {
              name: "Transmission Lines",
              subtopics: [
                { name: "Parameters", completed: false },
                { name: "Performance", completed: false },
                { name: "Ferranti Effect", completed: false }
              ],
              completed: false
            },
            {
              name: "Load Flow",
              subtopics: [
                { name: "Bus Classification", completed: false },
                { name: "Gauss-Seidel", completed: false },
                { name: "Newton-Raphson", completed: false }
              ],
              completed: false
            },
            {
              name: "Fault Analysis",
              subtopics: [
                { name: "Symmetrical Faults", completed: false },
                { name: "Unsymmetrical Faults", completed: false },
                { name: "Sequence Networks", completed: false }
              ],
              completed: false
            },
            {
              name: "Stability",
              subtopics: [
                { name: "Swing Equation", completed: false },
                { name: "Equal Area Criterion", completed: false },
                { name: "Critical Clearing Angle", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Power Electronics",
          priority: "high",
          topics: [
            {
              name: "Power Devices",
              subtopics: [
                { name: "Diode/Thyristor", completed: false },
                { name: "TRIAC/GTO", completed: false },
                { name: "MOSFET/IGBT", completed: false }
              ],
              completed: false
            },
            {
              name: "Converters",
              subtopics: [
                { name: "AC-DC Converters", completed: false },
                { name: "DC-DC Converters", completed: false },
                { name: "DC-AC Converters", completed: false }
              ],
              completed: false
            },
            {
              name: "Applications",
              subtopics: [
                { name: "Speed Control", completed: false },
                { name: "UPS", completed: false },
                { name: "HVDC", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Control Systems",
          priority: "high",
          topics: [
            {
              name: "Mathematical Modeling",
              subtopics: [
                { name: "Transfer Function", completed: false },
                { name: "State Space", completed: false },
                { name: "Block Diagrams", completed: false }
              ],
              completed: false
            },
            {
              name: "Time Response",
              subtopics: [
                { name: "First Order Systems", completed: false },
                { name: "Second Order Systems", completed: false },
                { name: "Steady State Error", completed: false }
              ],
              completed: false
            },
            {
              name: "Stability Analysis",
              subtopics: [
                { name: "Routh-Hurwitz", completed: false },
                { name: "Root Locus", completed: false },
                { name: "Nyquist Criterion", completed: false }
              ],
              completed: false
            },
            {
              name: "Compensators",
              subtopics: [
                { name: "Lead/Lag", completed: false },
                { name: "PID Controllers", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Electromagnetic Fields",
          priority: "medium",
          topics: [
            {
              name: "Electrostatics",
              subtopics: [
                { name: "Coulomb's Law", completed: false },
                { name: "Gauss's Law", completed: false },
                { name: "Electric Potential", completed: false }
              ],
              completed: false
            },
            {
              name: "Magnetostatics",
              subtopics: [
                { name: "Biot-Savart Law", completed: false },
                { name: "Ampere's Law", completed: false },
                { name: "Magnetic Materials", completed: false }
              ],
              completed: false
            },
            {
              name: "Time-Varying Fields",
              subtopics: [
                { name: "Faraday's Law", completed: false },
                { name: "Maxwell's Equations", completed: false },
                { name: "EM Waves", completed: false }
              ],
              completed: false
            }
          ]
        }
      ]
    },
    CSE: {
      subjects: [
        {
          name: "Data Structures & Algorithms",
          priority: "high",
          topics: [
            {
              name: "Arrays & Linked Lists",
              subtopics: [
                { name: "Array Operations", completed: false },
                { name: "Singly Linked Lists", completed: false },
                { name: "Doubly Linked Lists", completed: false }
              ],
              completed: false
            },
            {
              name: "Stacks & Queues",
              subtopics: [
                { name: "Stack Implementation", completed: false },
                { name: "Queue Implementation", completed: false },
                { name: "Applications", completed: false }
              ],
              completed: false
            },
            {
              name: "Trees",
              subtopics: [
                { name: "Binary Trees", completed: false },
                { name: "BST", completed: false },
                { name: "AVL Trees", completed: false }
              ],
              completed: false
            },
            {
              name: "Graphs",
              subtopics: [
                { name: "BFS/DFS", completed: false },
                { name: "Shortest Paths", completed: false },
                { name: "MST", completed: false }
              ],
              completed: false
            },
            {
              name: "Sorting & Searching",
              subtopics: [
                { name: "Comparison Sorts", completed: false },
                { name: "Linear Sorts", completed: false },
                { name: "Binary Search", completed: false }
              ],
              completed: false
            },
            {
              name: "Dynamic Programming",
              subtopics: [
                { name: "Memoization", completed: false },
                { name: "Tabulation", completed: false },
                { name: "Common Problems", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Computer Organization",
          priority: "high",
          topics: [
            {
              name: "Number Systems",
              subtopics: [
                { name: "Binary/Octal/Hex", completed: false },
                { name: "Complements", completed: false },
                { name: "Fixed/Floating Point", completed: false }
              ],
              completed: false
            },
            {
              name: "Boolean Algebra",
              subtopics: [
                { name: "Logic Gates", completed: false },
                { name: "K-Maps", completed: false },
                { name: "Quine-McCluskey", completed: false }
              ],
              completed: false
            },
            {
              name: "CPU Architecture",
              subtopics: [
                { name: "ALU Design", completed: false },
                { name: "Control Unit", completed: false },
                { name: "Pipelining", completed: false }
              ],
              completed: false
            },
            {
              name: "Memory Hierarchy",
              subtopics: [
                { name: "Cache Memory", completed: false },
                { name: "Virtual Memory", completed: false },
                { name: "Memory Organization", completed: false }
              ],
              completed: false
            },
            {
              name: "I/O Organization",
              subtopics: [
                { name: "Programmed I/O", completed: false },
                { name: "Interrupts", completed: false },
                { name: "DMA", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Operating Systems",
          priority: "high",
          topics: [
            {
              name: "Process Management",
              subtopics: [
                { name: "Process States", completed: false },
                { name: "Scheduling Algorithms", completed: false },
                { name: "IPC", completed: false }
              ],
              completed: false
            },
            {
              name: "Threads",
              subtopics: [
                { name: "User vs Kernel", completed: false },
                { name: "Multithreading Models", completed: false },
                { name: "Thread Issues", completed: false }
              ],
              completed: false
            },
            {
              name: "Synchronization",
              subtopics: [
                { name: "Critical Section", completed: false },
                { name: "Semaphores", completed: false },
                { name: "Deadlocks", completed: false }
              ],
              completed: false
            },
            {
              name: "Memory Management",
              subtopics: [
                { name: "Paging", completed: false },
                { name: "Segmentation", completed: false },
                { name: "Virtual Memory", completed: false }
              ],
              completed: false
            },
            {
              name: "File Systems",
              subtopics: [
                { name: "File Implementation", completed: false },
                { name: "Directory Structure", completed: false },
                { name: "Disk Scheduling", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Database Systems",
          priority: "high",
          topics: [
            {
              name: "ER Model",
              subtopics: [
                { name: "Entities & Relationships", completed: false },
                { name: "Keys", completed: false },
                { name: "ER to Relational", completed: false }
              ],
              completed: false
            },
            {
              name: "SQL",
              subtopics: [
                { name: "DDL/DML/DCL", completed: false },
                { name: "Joins", completed: false },
                { name: "Subqueries", completed: false }
              ],
              completed: false
            },
            {
              name: "Normalization",
              subtopics: [
                { name: "Functional Dependencies", completed: false },
                { name: "1NF-5NF", completed: false },
                { name: "BCNF", completed: false }
              ],
              completed: false
            },
            {
              name: "Transactions",
              subtopics: [
                { name: "ACID Properties", completed: false },
                { name: "Concurrency Control", completed: false },
                { name: "Recovery", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Computer Networks",
          priority: "medium",
          topics: [
            {
              name: "Physical Layer",
              subtopics: [
                { name: "Transmission Media", completed: false },
                { name: "Multiplexing", completed: false },
                { name: "Switching", completed: false }
              ],
              completed: false
            },
            {
              name: "Data Link Layer",
              subtopics: [
                { name: "Error Detection", completed: false },
                { name: "Flow Control", completed: false },
                { name: "MAC Protocols", completed: false }
              ],
              completed: false
            },
            {
              name: "Network Layer",
              subtopics: [
                { name: "IP Addressing", completed: false },
                { name: "Routing Algorithms", completed: false },
                { name: "IPv4/v6", completed: false }
              ],
              completed: false
            },
            {
              name: "Transport Layer",
              subtopics: [
                { name: "TCP/UDP", completed: false },
                { name: "Congestion Control", completed: false },
                { name: "Flow Control", completed: false }
              ],
              completed: false
            },
            {
              name: "Application Layer",
              subtopics: [
                { name: "HTTP/DNS", completed: false },
                { name: "SMTP/POP", completed: false },
                { name: "FTP", completed: false }
              ],
              completed: false
            }
          ]
        },
        {
          name: "Theory of Computation",
          priority: "medium",
          topics: [
            {
              name: "Automata",
              subtopics: [
                { name: "DFA/NFA", completed: false },
                { name: "Regular Expressions", completed: false },
                { name: "Pumping Lemma", completed: false }
              ],
              completed: false
            },
            {
              name: "Context-Free Languages",
              subtopics: [
                { name: "CFG", completed: false },
                { name: "PDA", completed: false },
                { name: "Chomsky Normal Form", completed: false }
              ],
              completed: false
            },
            {
              name: "Turing Machines",
              subtopics: [
                { name: "TM Design", completed: false },
                { name: "Variants", completed: false },
                { name: "Decidability", completed: false }
              ],
              completed: false
            },
            {
              name: "Complexity Theory",
              subtopics: [
                { name: "P vs NP", completed: false },
                { name: "NP-Completeness", completed: false },
                { name: "Reductions", completed: false }
              ],
              completed: false
            }
          ]
        }
      ]
    }
  };

  return syllabi[branch] || null;
};