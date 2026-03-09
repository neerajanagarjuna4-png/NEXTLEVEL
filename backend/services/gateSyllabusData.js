// GATE 2026 Official Syllabus Data for ECE, EE, CSE
// Source: Compiled from IIT Guwahati GATE 2026 official syllabus

export const getGATESyllabus = (branch) => {
  const syllabi = {
    ECE: {
      branchName: "Electronics and Communication Engineering",
      branchCode: "EC",
      totalTopics: 0, // Will be calculated
      totalSubtopics: 0, // Will be calculated
      engineeringMathematics: {
        name: "Engineering Mathematics",
        weightage: "13-15 marks",
        priority: "high",
        topics: [
          {
            name: "Linear Algebra",
            weightage: "3-4 marks",
            subtopics: [
              "Matrix Algebra",
              "Systems of Linear Equations",
              "Eigenvalues and Eigenvectors",
              "Rank of Matrix",
              "Diagonalization"
            ]
          },
          {
            name: "Calculus",
            weightage: "3-4 marks",
            subtopics: [
              "Mean Value Theorems",
              "Partial Derivatives",
              "Maxima and Minima",
              "Multiple Integrals",
              "Line and Surface Integrals",
              "Fourier Series",
              "Taylor Series"
            ]
          },
          {
            name: "Differential Equations",
            weightage: "3-4 marks",
            subtopics: [
              "First Order Equations",
              "Higher Order Linear Equations",
              "Cauchy-Euler Equation",
              "Laplace Transforms",
              "Partial Differential Equations",
              "Method of Separation of Variables"
            ]
          },
          {
            name: "Complex Analysis",
            weightage: "2-3 marks",
            subtopics: [
              "Analytic Functions",
              "Cauchy's Integral Theorem",
              "Cauchy's Integral Formula",
              "Taylor and Laurent Series",
              "Residue Theorem"
            ]
          },
          {
            name: "Probability and Statistics",
            weightage: "2-3 marks",
            subtopics: [
              "Probability Distributions",
              "Mean, Median, Mode",
              "Standard Deviation",
              "Random Variables",
              "Correlation and Regression"
            ]
          }
        ]
      },
      subjects: [
        {
          name: "Networks",
          priority: "high",
          weightage: "8-10 marks",
          topics: [
            {
              name: "Network Theorems",
              weightage: "3-4 marks",
              subtopics: [
                "Superposition Theorem",
                "Thevenin's Theorem",
                "Norton's Theorem",
                "Maximum Power Transfer Theorem",
                "Reciprocity Theorem",
                "Tellegen's Theorem"
              ]
            },
            {
              name: "Network Graphs",
              weightage: "2-3 marks",
              subtopics: [
                "Graph Theory Fundamentals",
                "Incidence Matrix",
                "Cut-set Matrix",
                "Loop Matrix",
                "Network Equations"
              ]
            },
            {
              name: "Transient Analysis",
              weightage: "3-4 marks",
              subtopics: [
                "RC Circuits",
                "RL Circuits",
                "RLC Circuits",
                "Initial and Final Conditions",
                "Step Response",
                "Impulse Response"
              ]
            },
            {
              name: "Two-Port Networks",
              weightage: "2-3 marks",
              subtopics: [
                "Z Parameters",
                "Y Parameters",
                "h Parameters",
                "ABCD Parameters",
                "Interconnections",
                "Network Functions"
              ]
            },
            {
              name: "Sinusoidal Steady State",
              weightage: "3-4 marks",
              subtopics: [
                "Phasor Representation",
                "Impedance and Admittance",
                "Power Calculations",
                "Resonance",
                "Magnetically Coupled Circuits"
              ]
            }
          ]
        },
        {
          name: "Electronic Devices",
          priority: "high",
          weightage: "8-10 marks",
          topics: [
            {
              name: "Semiconductor Physics",
              weightage: "3-4 marks",
              subtopics: [
                "Energy Bands",
                "Intrinsic and Extrinsic Semiconductors",
                "Carrier Concentration",
                "Drift and Diffusion",
                "Einstein Relation",
                "Continuity Equation"
              ]
            },
            {
              name: "PN Junction Diodes",
              weightage: "3-4 marks",
              subtopics: [
                "Junction Formation",
                "V-I Characteristics",
                "Junction Capacitance",
                "Breakdown Mechanisms",
                "Zener Diode",
                "Schottky Diode"
              ]
            },
            {
              name: "BJT",
              weightage: "3-4 marks",
              subtopics: [
                "Transistor Action",
                "Current Components",
                "Input/Output Characteristics",
                "Early Effect",
                "Ebers-Moll Model",
                "Biasing Techniques"
              ]
            },
            {
              name: "FET and MOSFET",
              weightage: "4-5 marks",
              subtopics: [
                "JFET Characteristics",
                "MOSFET Structure",
                "Enhancement and Depletion Modes",
                "V-I Characteristics",
                "Body Effect",
                "Channel Length Modulation"
              ]
            }
          ]
        },
        {
          name: "Analog Circuits",
          priority: "high",
          weightage: "10-12 marks",
          topics: [
            {
              name: "Diode Circuits",
              weightage: "2-3 marks",
              subtopics: [
                "Clippers and Clampers",
                "Rectifiers",
                "Filters",
                "Voltage Multipliers"
              ]
            },
            {
              name: "BJT Amplifiers",
              weightage: "3-4 marks",
              subtopics: [
                "CE Configuration",
                "CB Configuration",
                "CC Configuration",
                "Biasing Stability",
                "Frequency Response",
                "Multistage Amplifiers"
              ]
            },
            {
              name: "FET Amplifiers",
              weightage: "2-3 marks",
              subtopics: [
                "CS Configuration",
                "CG Configuration",
                "CD Configuration",
                "Biasing Methods"
              ]
            },
            {
              name: "Operational Amplifiers",
              weightage: "4-5 marks",
              subtopics: [
                "Ideal Op-Amp Characteristics",
                "Inverting Amplifier",
                "Non-Inverting Amplifier",
                "Summing Amplifier",
                "Difference Amplifier",
                "Integrator and Differentiator",
                "Comparator",
                "Schmitt Trigger",
                "Instrumentation Amplifier"
              ]
            },
            {
              name: "Feedback Amplifiers",
              weightage: "2-3 marks",
              subtopics: [
                "Feedback Topologies",
                "Gain Desensitivity",
                "Bandwidth Extension",
                "Oscillators",
                "RC and LC Oscillators"
              ]
            }
          ]
        },
        {
          name: "Digital Circuits",
          priority: "high",
          weightage: "10-12 marks",
          topics: [
            {
              name: "Boolean Algebra",
              weightage: "2-3 marks",
              subtopics: [
                "Boolean Laws",
                "DeMorgan's Theorems",
                "SOP and POS Forms",
                "K-Maps (2-5 variables)",
                "Quine-McCluskey Method"
              ]
            },
            {
              name: "Logic Gates",
              weightage: "2-3 marks",
              subtopics: [
                "Basic Gates",
                "Universal Gates",
                "Logic Families",
                "TTL and CMOS Characteristics"
              ]
            },
            {
              name: "Combinational Circuits",
              weightage: "3-4 marks",
              subtopics: [
                "Adders and Subtractors",
                "Multiplexers",
                "Demultiplexers",
                "Encoders",
                "Decoders",
                "Code Converters",
                "Parity Generators"
              ]
            },
            {
              name: "Sequential Circuits",
              weightage: "4-5 marks",
              subtopics: [
                "Flip-Flops (SR, JK, D, T)",
                "Master-Slave Configuration",
                "Registers",
                "Counters (Synchronous/Asynchronous)",
                "Ring Counters",
                "Johnson Counters",
                "State Machines"
              ]
            },
            {
              name: "Memory and Programmable Logic",
              weightage: "2-3 marks",
              subtopics: [
                "ROM and RAM",
                "PLA",
                "PAL",
                "FPGA Basics"
              ]
            }
          ]
        },
        {
          name: "Signals and Systems",
          priority: "high",
          weightage: "10-12 marks",
          topics: [
            {
              name: "Continuous Time Signals",
              weightage: "3-4 marks",
              subtopics: [
                "Signal Classifications",
                "Basic Operations",
                "Elementary Signals",
                "Signal Properties"
              ]
            },
            {
              name: "Discrete Time Signals",
              weightage: "2-3 marks",
              subtopics: [
                "DT Signal Classifications",
                "Sampling Theorem",
                "Aliasing",
                "Quantization"
              ]
            },
            {
              name: "LTI Systems",
              weightage: "3-4 marks",
              subtopics: [
                "Impulse Response",
                "Convolution",
                "Properties of LTI Systems",
                "Stability",
                "Causality"
              ]
            },
            {
              name: "Fourier Analysis",
              weightage: "4-5 marks",
              subtopics: [
                "Fourier Series",
                "Fourier Transform",
                "Properties of Fourier Transform",
                "Parseval's Theorem",
                "DTFT",
                "DFT",
                "FFT"
              ]
            },
            {
              name: "Laplace Transform",
              weightage: "2-3 marks",
              subtopics: [
                "ROC",
                "Properties",
                "Inverse Laplace",
                "System Analysis"
              ]
            },
            {
              name: "Z-Transform",
              weightage: "2-3 marks",
              subtopics: [
                "ROC",
                "Properties",
                "Inverse Z-Transform",
                "System Analysis"
              ]
            }
          ]
        },
        {
          name: "Control Systems",
          priority: "medium",
          weightage: "6-8 marks",
          topics: [
            {
              name: "Block Diagrams",
              weightage: "2-3 marks",
              subtopics: [
                "Transfer Functions",
                "Block Diagram Reduction",
                "Signal Flow Graphs",
                "Mason's Gain Formula"
              ]
            },
            {
              name: "Time Response Analysis",
              weightage: "2-3 marks",
              subtopics: [
                "First Order Systems",
                "Second Order Systems",
                "Time Domain Specifications",
                "Steady State Errors",
                "Error Constants"
              ]
            },
            {
              name: "Stability Analysis",
              weightage: "3-4 marks",
              subtopics: [
                "Routh-Hurwitz Criterion",
                "Root Locus",
                "Nyquist Criterion",
                "Bode Plots",
                "Gain and Phase Margins"
              ]
            },
            {
              name: "Compensators",
              weightage: "2-3 marks",
              subtopics: [
                "Lead Compensator",
                "Lag Compensator",
                "Lag-Lead Compensator",
                "PID Controllers"
              ]
            }
          ]
        },
        {
          name: "Communications",
          priority: "medium",
          weightage: "8-10 marks",
          topics: [
            {
              name: "Analog Communication",
              weightage: "3-4 marks",
              subtopics: [
                "AM Modulation",
                "DSB-SC",
                "SSB",
                "FM Modulation",
                "PM Modulation",
                "Modulators and Demodulators",
                "Noise in Analog Systems"
              ]
            },
            {
              name: "Digital Communication",
              weightage: "4-5 marks",
              subtopics: [
                "PCM",
                "DPCM",
                "Delta Modulation",
                "ASK, FSK, PSK",
                "QPSK",
                "MSK",
                "Error Probability"
              ]
            },
            {
              name: "Information Theory",
              weightage: "2-3 marks",
              subtopics: [
                "Entropy",
                "Source Coding",
                "Channel Capacity",
                "Shannon's Theorems",
                "Error Control Codes"
              ]
            }
          ]
        },
        {
          name: "Electromagnetics",
          priority: "medium",
          weightage: "6-8 marks",
          topics: [
            {
              name: "Vector Analysis",
              weightage: "2-3 marks",
              subtopics: [
                "Coordinate Systems",
                "Gradient, Divergence, Curl",
                "Line, Surface, Volume Integrals",
                "Stokes Theorem",
                "Divergence Theorem"
              ]
            },
            {
              name: "Electrostatics",
              weightage: "2-3 marks",
              subtopics: [
                "Coulomb's Law",
                "Gauss's Law",
                "Electric Potential",
                "Boundary Conditions",
                "Capacitance"
              ]
            },
            {
              name: "Magnetostatics",
              weightage: "2-3 marks",
              subtopics: [
                "Biot-Savart Law",
                "Ampere's Law",
                "Magnetic Vector Potential",
                "Boundary Conditions",
                "Inductance"
              ]
            },
            {
              name: "Maxwell's Equations",
              weightage: "2-3 marks",
              subtopics: [
                "Faraday's Law",
                "Displacement Current",
                "Maxwell's Equations",
                "Wave Equation",
                "Plane Waves",
                "Poynting Vector"
              ]
            }
          ]
        }
      ],
      generalAptitude: {
        name: "General Aptitude",
        weightage: "15 marks",
        priority: "high",
        topics: [
          {
            name: "Verbal Ability",
            subtopics: [
              "English Grammar",
              "Vocabulary",
              "Sentence Completion",
              "Synonyms and Antonyms",
              "Reading Comprehension"
            ]
          },
          {
            name: "Quantitative Aptitude",
            subtopics: [
              "Arithmetic",
              "Algebra",
              "Geometry",
              "Mensuration",
              "Statistics"
            ]
          },
          {
            name: "Logical Reasoning",
            subtopics: [
              "Number Series",
              "Analogy",
              "Coding-Decoding",
              "Blood Relations",
              "Direction Sense"
            ]
          },
          {
            name: "Analytical Reasoning",
            subtopics: [
              "Data Interpretation",
              "Puzzles",
              "Venn Diagrams",
              "Cause and Effect"
            ]
          }
        ]
      }
    },

    EE: {
      branchName: "Electrical Engineering",
      branchCode: "EE",
      totalTopics: 0,
      totalSubtopics: 0,
      engineeringMathematics: {
        name: "Engineering Mathematics",
        weightage: "13-15 marks",
        priority: "high",
        topics: [
          {
            name: "Linear Algebra",
            subtopics: [
              "Matrix Algebra",
              "Systems of Linear Equations",
              "Eigenvalues and Eigenvectors",
              "Rank of Matrix"
            ]
          },
          {
            name: "Calculus",
            subtopics: [
              "Mean Value Theorems",
              "Partial Derivatives",
              "Maxima and Minima",
              "Multiple Integrals",
              "Fourier Series"
            ]
          },
          {
            name: "Differential Equations",
            subtopics: [
              "First Order Equations",
              "Higher Order Linear Equations",
              "Laplace Transforms",
              "Partial Differential Equations"
            ]
          },
          {
            name: "Complex Analysis",
            subtopics: [
              "Analytic Functions",
              "Cauchy's Integral Theorem",
              "Residue Theorem"
            ]
          },
          {
            name: "Probability and Statistics",
            subtopics: [
              "Probability Distributions",
              "Mean, Median, Mode",
              "Random Variables",
              "Correlation"
            ]
          },
          {
            name: "Numerical Methods",
            subtopics: [
              "Newton-Raphson Method",
              "Gauss Elimination",
              "Numerical Integration"
            ]
          }
        ]
      },
      subjects: [
        {
          name: "Electrical Machines",
          priority: "high",
          weightage: "12-15 marks",
          topics: [
            {
              name: "Transformers",
              subtopics: [
                "Ideal Transformer",
                "Equivalent Circuit",
                "Voltage Regulation",
                "Efficiency",
                "Autotransformer",
                "Three-Phase Transformer Connections"
              ]
            },
            {
              name: "DC Machines",
              subtopics: [
                "Construction",
                "Armature Reaction",
                "Commutation",
                "Characteristics",
                "Starting and Speed Control",
                "Testing"
              ]
            },
            {
              name: "Induction Motors",
              subtopics: [
                "Three-Phase Induction Motor",
                "Torque-Slip Characteristics",
                "Equivalent Circuit",
                "Starting Methods",
                "Speed Control",
                "Single-Phase Induction Motors"
              ]
            },
            {
              name: "Synchronous Machines",
              subtopics: [
                "Alternators",
                "Synchronous Motors",
                "V-Curves",
                "Parallel Operation",
                "Hunting"
              ]
            },
            {
              name: "Special Machines",
              subtopics: [
                "Stepper Motors",
                "BLDC Motors",
                "Servomotors",
                "Reluctance Motors"
              ]
            }
          ]
        },
        {
          name: "Power Systems",
          priority: "high",
          weightage: "12-15 marks",
          topics: [
            {
              name: "Transmission Lines",
              subtopics: [
                "Line Parameters",
                "Performance",
                "Ferranti Effect",
                "Corona",
                "Surge Impedance Loading",
                "Underground Cables"
              ]
            },
            {
              name: "Load Flow Analysis",
              subtopics: [
                "Bus Classification",
                "Gauss-Seidel Method",
                "Newton-Raphson Method",
                "Fast Decoupled Method"
              ]
            },
            {
              name: "Fault Analysis",
              subtopics: [
                "Symmetrical Faults",
                "Unsymmetrical Faults",
                "Sequence Networks",
                "Fault Current Calculations"
              ]
            },
            {
              name: "Stability",
              subtopics: [
                "Swing Equation",
                "Equal Area Criterion",
                "Critical Clearing Angle",
                "Transient Stability",
                "Steady State Stability"
              ]
            },
            {
              name: "Power System Protection",
              subtopics: [
                "Protective Relays",
                "Circuit Breakers",
                "Distance Protection",
                "Differential Protection",
                "Overcurrent Protection"
              ]
            },
            {
              name: "Economic Operation",
              subtopics: [
                "Economic Dispatch",
                "Unit Commitment",
                "Hydro-Thermal Scheduling"
              ]
            }
          ]
        },
        {
          name: "Power Electronics",
          priority: "high",
          weightage: "10-12 marks",
          topics: [
            {
              name: "Power Semiconductor Devices",
              subtopics: [
                "Power Diodes",
                "Thyristors (SCR)",
                "TRIAC",
                "GTO",
                "Power MOSFET",
                "IGBT",
                "Switching Characteristics"
              ]
            },
            {
              name: "AC-DC Converters",
              subtopics: [
                "Single-Phase Rectifiers",
                "Three-Phase Rectifiers",
                "Controlled Rectifiers",
                "Effect of Source Inductance"
              ]
            },
            {
              name: "DC-DC Converters",
              subtopics: [
                "Buck Converter",
                "Boost Converter",
                "Buck-Boost Converter",
                "Cuk Converter",
                "Isolated Converters"
              ]
            },
            {
              name: "DC-AC Converters",
              subtopics: [
                "Single-Phase Inverters",
                "Three-Phase Inverters",
                "PWM Techniques",
                "Harmonic Reduction"
              ]
            },
            {
              name: "AC-AC Converters",
              subtopics: [
                "AC Voltage Controllers",
                "Cycloconverters",
                "Matrix Converters"
              ]
            },
            {
              name: "Applications",
              subtopics: [
                "Motor Drives",
                "UPS Systems",
                "HVDC Transmission",
                "FACTS Devices"
              ]
            }
          ]
        },
        {
          name: "Control Systems",
          priority: "high",
          weightage: "8-10 marks",
          topics: [
            {
              name: "Mathematical Modeling",
              subtopics: [
                "Transfer Function",
                "State Space Representation",
                "Block Diagrams",
                "Signal Flow Graphs"
              ]
            },
            {
              name: "Time Response Analysis",
              subtopics: [
                "First Order Systems",
                "Second Order Systems",
                "Time Domain Specifications",
                "Steady State Errors"
              ]
            },
            {
              name: "Stability Analysis",
              subtopics: [
                "Routh-Hurwitz Criterion",
                "Root Locus",
                "Nyquist Criterion",
                "Bode Plots",
                "Gain and Phase Margins"
              ]
            },
            {
              name: "Compensators and Controllers",
              subtopics: [
                "Lead Compensator",
                "Lag Compensator",
                "PID Controllers",
                "State Feedback Control"
              ]
            }
          ]
        },
        {
          name: "Electromagnetic Fields",
          priority: "medium",
          weightage: "6-8 marks",
          topics: [
            {
              name: "Electrostatics",
              subtopics: [
                "Coulomb's Law",
                "Gauss's Law",
                "Electric Potential",
                "Boundary Conditions",
                "Capacitance"
              ]
            },
            {
              name: "Magnetostatics",
              subtopics: [
                "Biot-Savart Law",
                "Ampere's Law",
                "Magnetic Vector Potential",
                "Boundary Conditions",
                "Inductance"
              ]
            },
            {
              name: "Time-Varying Fields",
              subtopics: [
                "Faraday's Law",
                "Maxwell's Equations",
                "EM Waves",
                "Poynting Vector"
              ]
            }
          ]
        },
        {
          name: "Electrical Measurements",
          priority: "medium",
          weightage: "6-8 marks",
          topics: [
            {
              name: "Measurement Systems",
              subtopics: [
                "SI Units",
                "Standards",
                "Errors in Measurement",
                "Statistical Analysis"
              ]
            },
            {
              name: "Bridges and Potentiometers",
              subtopics: [
                "Wheatstone Bridge",
                "Kelvin Bridge",
                "AC Bridges",
                "Potentiometers"
              ]
            },
            {
              name: "Instruments",
              subtopics: [
                "PMMC Instruments",
                "Moving Iron Instruments",
                "Dynamometer Instruments",
                "Energy Meters",
                "Digital Instruments"
              ]
            },
            {
              name: "Sensors and Transducers",
              subtopics: [
                "Resistive Sensors",
                "Capacitive Sensors",
                "Inductive Sensors",
                "Temperature Sensors",
                "Strain Gauges"
              ]
            }
          ]
        },
        {
          name: "Analog and Digital Electronics",
          priority: "medium",
          weightage: "8-10 marks",
          topics: [
            {
              name: "Diodes and Applications",
              subtopics: [
                "Rectifiers",
                "Zener Regulators",
                "Clippers and Clampers"
              ]
            },
            {
              name: "Transistors and Amplifiers",
              subtopics: [
                "BJT Biasing",
                "Small Signal Analysis",
                "FET Amplifiers",
                "Multistage Amplifiers"
              ]
            },
            {
              name: "Operational Amplifiers",
              subtopics: [
                "Inverting Amplifier",
                "Non-Inverting Amplifier",
                "Integrator",
                "Differentiator",
                "Comparators"
              ]
            },
            {
              name: "Digital Logic",
              subtopics: [
                "Boolean Algebra",
                "Logic Gates",
                "Combinational Circuits",
                "Sequential Circuits"
              ]
            }
          ]
        }
      ],
      generalAptitude: {
        name: "General Aptitude",
        weightage: "15 marks",
        priority: "high",
        topics: [
          {
            name: "Verbal Ability",
            subtopics: [
              "Grammar",
              "Vocabulary",
              "Comprehension"
            ]
          },
          {
            name: "Quantitative Aptitude",
            subtopics: [
              "Arithmetic",
              "Algebra",
              "Geometry"
            ]
          },
          {
            name: "Logical Reasoning",
            subtopics: [
              "Series",
              "Analogy",
              "Puzzles"
            ]
          }
        ]
      }
    },

    CSE: {
      branchName: "Computer Science and Engineering",
      branchCode: "CS",
      totalTopics: 0,
      totalSubtopics: 0,
      engineeringMathematics: {
        name: "Engineering Mathematics",
        weightage: "13-15 marks",
        priority: "high",
        topics: [
          {
            name: "Discrete Mathematics",
            weightage: "4-5 marks",
            subtopics: [
              "Propositional Logic",
              "Predicate Logic",
              "Sets and Relations",
              "Functions",
              "Partial Orders",
              "Lattices",
              "Groups",
              "Combinatorics",
              "Counting",
              "Recurrence Relations",
              "Generating Functions"
            ]
          },
          {
            name: "Linear Algebra",
            weightage: "3-4 marks",
            subtopics: [
              "Matrix Algebra",
              "Systems of Linear Equations",
              "Eigenvalues and Eigenvectors",
              "Vector Spaces",
              "Linear Independence",
              "Rank of Matrix"
            ]
          },
          {
            name: "Calculus",
            weightage: "2-3 marks",
            subtopics: [
              "Limits and Continuity",
              "Differentiation",
              "Integration",
              "Partial Derivatives",
              "Maxima and Minima"
            ]
          },
          {
            name: "Probability",
            weightage: "3-4 marks",
            subtopics: [
              "Probability Axioms",
              "Conditional Probability",
              "Random Variables",
              "Probability Distributions",
              "Expectation",
              "Bayes Theorem"
            ]
          }
        ]
      },
      subjects: [
        {
          name: "Digital Logic",
          priority: "high",
          weightage: "5-7 marks",
          topics: [
            {
              name: "Boolean Algebra",
              subtopics: [
                "Boolean Laws",
                "DeMorgan's Theorems",
                "SOP and POS Forms",
                "K-Maps",
                "Quine-McCluskey Method"
              ]
            },
            {
              name: "Logic Gates",
              subtopics: [
                "Basic Gates",
                "Universal Gates",
                "Logic Families",
                "Fan-in/Fan-out"
              ]
            },
            {
              name: "Combinational Circuits",
              subtopics: [
                "Adders",
                "Subtractors",
                "Multiplexers",
                "Demultiplexers",
                "Encoders",
                "Decoders"
              ]
            },
            {
              name: "Sequential Circuits",
              subtopics: [
                "Flip-Flops",
                "Registers",
                "Counters",
                "Finite State Machines"
              ]
            },
            {
              name: "Number Systems",
              subtopics: [
                "Binary Numbers",
                "Octal Numbers",
                "Hexadecimal Numbers",
                "Number Base Conversions",
                "Complement Arithmetic",
                "Fixed and Floating Point"
              ]
            }
          ]
        },
        {
          name: "Computer Organization and Architecture",
          priority: "high",
          weightage: "7-9 marks",
          topics: [
            {
              name: "Machine Instructions",
              subtopics: [
                "Instruction Formats",
                "Addressing Modes",
                "Instruction Types",
                "RISC vs CISC"
              ]
            },
            {
              name: "ALU Design",
              subtopics: [
                "Arithmetic Circuits",
                "Logic Circuits",
                "Fast Adders",
                "Multipliers"
              ]
            },
            {
              name: "Control Unit",
              subtopics: [
                "Hardwired Control",
                "Microprogrammed Control",
                "Control Signals"
              ]
            },
            {
              name: "Pipelining",
              subtopics: [
                "Pipeline Stages",
                "Pipeline Hazards",
                "Data Hazards",
                "Control Hazards",
                "Structural Hazards",
                "Hazard Detection",
                "Forwarding"
              ]
            },
            {
              name: "Memory Hierarchy",
              subtopics: [
                "Cache Memory",
                "Cache Mapping",
                "Cache Performance",
                "Main Memory",
                "Virtual Memory",
                "TLB",
                "Secondary Storage"
              ]
            },
            {
              name: "I/O Organization",
              subtopics: [
                "Programmed I/O",
                "Interrupt-Driven I/O",
                "DMA",
                "I/O Processors"
              ]
            }
          ]
        },
        {
          name: "Programming and Data Structures",
          priority: "high",
          weightage: "10-12 marks",
          topics: [
            {
              name: "Programming in C",
              subtopics: [
                "Variables and Data Types",
                "Operators",
                "Control Structures",
                "Functions",
                "Arrays",
                "Pointers",
                "Strings",
                "Structures",
                "Dynamic Memory Allocation",
                "File Handling"
              ]
            },
            {
              name: "Recursion",
              subtopics: [
                "Recursive Functions",
                "Tail Recursion",
                "Backtracking",
                "Divide and Conquer"
              ]
            },
            {
              name: "Arrays",
              subtopics: [
                "Array Operations",
                "Multi-dimensional Arrays",
                "Sparse Arrays",
                "Array Algorithms"
              ]
            },
            {
              name: "Linked Lists",
              subtopics: [
                "Singly Linked Lists",
                "Doubly Linked Lists",
                "Circular Linked Lists",
                "Operations",
                "Applications"
              ]
            },
            {
              name: "Stacks and Queues",
              subtopics: [
                "Stack Implementation",
                "Queue Implementation",
                "Circular Queues",
                "Deque",
                "Priority Queues",
                "Applications"
              ]
            },
            {
              name: "Trees",
              subtopics: [
                "Binary Trees",
                "Tree Traversals",
                "Binary Search Trees",
                "AVL Trees",
                "Red-Black Trees",
                "B-Trees",
                "Heap"
              ]
            },
            {
              name: "Graphs",
              subtopics: [
                "Graph Representations",
                "BFS",
                "DFS",
                "Topological Sort"
              ]
            },
            {
              name: "Hashing",
              subtopics: [
                "Hash Functions",
                "Collision Resolution",
                "Chaining",
                "Open Addressing"
              ]
            }
          ]
        },
        {
          name: "Algorithms",
          priority: "high",
          weightage: "10-12 marks",
          topics: [
            {
              name: "Algorithm Analysis",
              subtopics: [
                "Time Complexity",
                "Space Complexity",
                "Asymptotic Notations",
                "Recurrence Relations",
                "Master Theorem"
              ]
            },
            {
              name: "Searching and Sorting",
              subtopics: [
                "Linear Search",
                "Binary Search",
                "Bubble Sort",
                "Selection Sort",
                "Insertion Sort",
                "Merge Sort",
                "Quick Sort",
                "Heap Sort",
                "Counting Sort",
                "Radix Sort"
              ]
            },
            {
              name: "Greedy Algorithms",
              subtopics: [
                "Activity Selection",
                "Fractional Knapsack",
                "Huffman Coding",
                "Job Sequencing"
              ]
            },
            {
              name: "Dynamic Programming",
              subtopics: [
                "Memoization",
                "Tabulation",
                "0/1 Knapsack",
                "Unbounded Knapsack",
                "LCS",
                "LIS",
                "Matrix Chain Multiplication",
                "Edit Distance"
              ]
            },
            {
              name: "Divide and Conquer",
              subtopics: [
                "Merge Sort",
                "Quick Sort",
                "Binary Search",
                "Strassen's Multiplication"
              ]
            },
            {
              name: "Graph Algorithms",
              subtopics: [
                "Minimum Spanning Trees",
                "Prim's Algorithm",
                "Kruskal's Algorithm",
                "Shortest Paths",
                "Dijkstra's Algorithm",
                "Bellman-Ford",
                "Floyd-Warshall",
                "Union-Find"
              ]
            }
          ]
        },
        {
          name: "Theory of Computation",
          priority: "medium",
          weightage: "5-7 marks",
          topics: [
            {
              name: "Regular Languages",
              subtopics: [
                "Finite Automata",
                "DFA",
                "NFA",
                "Regular Expressions",
                "Pumping Lemma",
                "Closure Properties"
              ]
            },
            {
              name: "Context-Free Languages",
              subtopics: [
                "Context-Free Grammars",
                "Pushdown Automata",
                "CFG Simplification",
                "Normal Forms",
                "Pumping Lemma for CFL"
              ]
            },
            {
              name: "Turing Machines",
              subtopics: [
                "Turing Machine Model",
                "Variants",
                "Recursive Languages",
                "Recursively Enumerable Languages"
              ]
            },
            {
              name: "Undecidability",
              subtopics: [
                "Halting Problem",
                "Reducibility",
                "Rice's Theorem"
              ]
            }
          ]
        },
        {
          name: "Compiler Design",
          priority: "medium",
          weightage: "4-6 marks",
          topics: [
            {
              name: "Lexical Analysis",
              subtopics: [
                "Tokens",
                "Patterns",
                "Lexemes",
                "Regular Expressions",
                "Finite Automata",
                "Lex Tool"
              ]
            },
            {
              name: "Parsing",
              subtopics: [
                "Top-Down Parsing",
                "LL Parsers",
                "Bottom-Up Parsing",
                "LR Parsers",
                "SLR",
                "CLR",
                "LALR",
                "Ambiguity"
              ]
            },
            {
              name: "Syntax-Directed Translation",
              subtopics: [
                "SDD",
                "SDT",
                "Syntax Trees",
                "Three-Address Code"
              ]
            },
            {
              name: "Runtime Environments",
              subtopics: [
                "Activation Records",
                "Stack Allocation",
                "Heap Allocation",
                "Garbage Collection"
              ]
            },
            {
              name: "Code Optimization",
              subtopics: [
                "Local Optimization",
                "Global Optimization",
                "Loop Optimization",
                "Data Flow Analysis"
              ]
            }
          ]
        },
        {
          name: "Operating Systems",
          priority: "high",
          weightage: "8-10 marks",
          topics: [
            {
              name: "Process Management",
              subtopics: [
                "Process States",
                "PCB",
                "Process Creation",
                "Process Termination",
                "Context Switching"
              ]
            },
            {
              name: "Threads",
              subtopics: [
                "User Threads",
                "Kernel Threads",
                "Multithreading Models"
              ]
            },
            {
              name: "CPU Scheduling",
              subtopics: [
                "FCFS",
                "SJF",
                "Round Robin",
                "Priority Scheduling",
                "Multilevel Queue",
                "Multilevel Feedback Queue"
              ]
            },
            {
              name: "Process Synchronization",
              subtopics: [
                "Critical Section",
                "Mutex",
                "Semaphores",
                "Monitors",
                "Classical Problems",
                "Deadlocks",
                "Deadlock Prevention",
                "Deadlock Avoidance",
                "Deadlock Detection",
                "Banker's Algorithm"
              ]
            },
            {
              name: "Memory Management",
              subtopics: [
                "Contiguous Allocation",
                "Paging",
                "Segmentation",
                "Virtual Memory",
                "Demand Paging",
                "Page Replacement",
                "FIFO",
                "LRU",
                "Optimal",
                "Thrashing"
              ]
            },
            {
              name: "File Systems",
              subtopics: [
                "File Concepts",
                "Directory Structure",
                "File Allocation Methods",
                "Free Space Management",
                "Disk Scheduling"
              ]
            }
          ]
        },
        {
          name: "Databases",
          priority: "high",
          weightage: "8-10 marks",
          topics: [
            {
              name: "ER Model",
              subtopics: [
                "Entities",
                "Relationships",
                "Attributes",
                "Keys",
                "ER Diagrams"
              ]
            },
            {
              name: "Relational Model",
              subtopics: [
                "Relational Algebra",
                "Tuple Calculus",
                "Domain Calculus",
                "SQL",
                "DDL",
                "DML",
                "DCL",
                "Joins",
                "Subqueries"
              ]
            },
            {
              name: "Normalization",
              subtopics: [
                "Functional Dependencies",
                "1NF",
                "2NF",
                "3NF",
                "BCNF",
                "4NF",
                "5NF",
                "Lossless Decomposition",
                "Dependency Preservation"
              ]
            },
            {
              name: "File Organization",
              subtopics: [
                "Heap Files",
                "Sorted Files",
                "Hashing",
                "B-Trees",
                "B+ Trees",
                "Indexing"
              ]
            },
            {
              name: "Transactions",
              subtopics: [
                "ACID Properties",
                "Transaction States",
                "Concurrency Control",
                "Locking Protocols",
                "Deadlocks",
                "Timestamp Ordering",
                "Recovery",
                "Log-Based Recovery"
              ]
            }
          ]
        },
        {
          name: "Computer Networks",
          priority: "medium",
          weightage: "6-8 marks",
          topics: [
            {
              name: "Network Models",
              subtopics: [
                "OSI Model",
                "TCP/IP Model",
                "Layering Principles"
              ]
            },
            {
              name: "Physical Layer",
              subtopics: [
                "Transmission Media",
                "Multiplexing",
                "Switching",
                "Circuit Switching",
                "Packet Switching"
              ]
            },
            {
              name: "Data Link Layer",
              subtopics: [
                "Framing",
                "Error Detection",
                "Error Correction",
                "Flow Control",
                "Sliding Window Protocol",
                "MAC Protocols",
                "CSMA/CD",
                "CSMA/CA",
                "Ethernet",
                "Switching"
              ]
            },
            {
              name: "Network Layer",
              subtopics: [
                "IP Addressing",
                "Subnetting",
                "CIDR",
                "Routing Algorithms",
                "Distance Vector",
                "Link State",
                "RIP",
                "OSPF",
                "BGP",
                "IPv4",
                "IPv6",
                "ARP",
                "ICMP",
                "NAT"
              ]
            },
            {
              name: "Transport Layer",
              subtopics: [
                "UDP",
                "TCP",
                "Flow Control",
                "Congestion Control",
                "TCP Tahoe",
                "TCP Reno",
                "Sockets"
              ]
            },
            {
              name: "Application Layer",
              subtopics: [
                "DNS",
                "HTTP",
                "HTTPS",
                "FTP",
                "SMTP",
                "POP3",
                "IMAP",
                "DHCP",
                "SNMP"
              ]
            }
          ]
        }
      ],
      generalAptitude: {
        name: "General Aptitude",
        weightage: "15 marks",
        priority: "high",
        topics: [
          {
            name: "Verbal Ability",
            subtopics: [
              "Grammar",
              "Vocabulary",
              "Sentence Completion",
              "Synonyms",
              "Antonyms",
              "Reading Comprehension"
            ]
          },
          {
            name: "Quantitative Aptitude",
            subtopics: [
              "Number Systems",
              "Arithmetic",
              "Algebra",
              "Geometry",
              "Mensuration",
              "Trigonometry",
              "Statistics"
            ]
          },
          {
            name: "Logical Reasoning",
            subtopics: [
              "Number Series",
              "Letter Series",
              "Analogies",
              "Blood Relations",
              "Direction Sense",
              "Coding-Decoding",
              "Puzzles"
            ]
          },
          {
            name: "Analytical Reasoning",
            subtopics: [
              "Data Interpretation",
              "Venn Diagrams",
              "Cause and Effect",
              "Statements and Conclusions"
            ]
          }
        ]
      }
    }
  };

  // Calculate totals for each branch
  Object.keys(syllabi).forEach(branch => {
    let totalTopics = 0;
    let totalSubtopics = 0;
    
    // Count from engineering mathematics
    if (syllabi[branch].engineeringMathematics) {
      syllabi[branch].engineeringMathematics.topics.forEach(topic => {
        totalTopics++;
        totalSubtopics += topic.subtopics.length;
      });
    }
    
    // Count from core subjects
    syllabi[branch].subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        totalTopics++;
        totalSubtopics += topic.subtopics.length;
      });
    });
    
    // Count from general aptitude
    if (syllabi[branch].generalAptitude) {
      syllabi[branch].generalAptitude.topics.forEach(topic => {
        totalTopics++;
        totalSubtopics += topic.subtopics.length;
      });
    }
    
    syllabi[branch].totalTopics = totalTopics;
    syllabi[branch].totalSubtopics = totalSubtopics;
  });

  return syllabi[branch] || null;
};