// Flashcards data for all branches
// Flashcards data for all branches
// 20+ cards per branch: ECE, EE, CSE

export const flashcardsData = {
  ECE: [
    { id: 'fc-ece-001', branch: 'ECE', subject: 'Network Theory', topic: "Thevenin's Theorem", front: "State Thevenin's Theorem", back: "Any linear two-terminal circuit can be replaced by Vth in series with Rth.", formula: "V_th = V_oc; R_th = V_oc / I_sc", difficulty: 'medium', tags: ['theorem','network'] },
    { id: 'fc-ece-002', branch: 'ECE', subject: 'Signals & Systems', topic: 'Laplace Transform', front: 'Definition of Laplace transform', back: 'L{f(t)} = ∫_0^∞ e^{-st} f(t) dt', formula: 'F(s) = ∫ e^{-st} f(t) dt', difficulty: 'medium', tags: ['transform'] },
    { id: 'fc-ece-003', branch: 'ECE', subject: 'Digital', topic: 'De Morgan', front: 'De Morgan theorem (complements)', back: '(A·B)′ = A′ + B′ ; (A + B)′ = A′·B′', difficulty: 'easy', tags: ['logic'] },
    { id: 'fc-ece-004', branch: 'ECE', subject: 'Control Systems', topic: 'Bode Plot', front: 'What is slope change per pole?', back: 'Each pole contributes −20 dB/decade to magnitude slope.', difficulty: 'medium', tags: ['frequency'] },
    { id: 'fc-ece-005', branch: 'ECE', subject: 'Analog', topic: 'Op-Amp', front: 'Ideal op-amp properties', back: 'Infinite gain, infinite input impedance, zero output impedance.', difficulty: 'easy', tags: ['amplifier'] },
    { id: 'fc-ece-006', branch: 'ECE', subject: 'Signals & Systems', topic: 'Sampling', front: 'Nyquist sampling criterion', back: 'fs > 2 * f_max to avoid aliasing.', difficulty: 'easy', tags: ['sampling'] },
    { id: 'fc-ece-007', branch: 'ECE', subject: 'EDC', topic: 'MOSFET Regions', front: 'MOSFET saturation condition', back: 'Vds > Vgs - Vth (for long-channel approximation).', difficulty: 'medium', tags: ['device'] },
    { id: 'fc-ece-008', branch: 'ECE', subject: 'EMFT', topic: 'Transmission Lines', front: 'Characteristic impedance (lossless)', back: 'Z0 = sqrt(L/C)', difficulty: 'medium', tags: ['wave'] },
    { id: 'fc-ece-009', branch: 'ECE', subject: 'Mathematics', topic: 'Eigenvalues', front: 'Positive definite matrix criterion', back: 'All eigenvalues positive', difficulty: 'medium', tags: ['linear algebra'] },
    { id: 'fc-ece-010', branch: 'ECE', subject: 'Communications', topic: 'AM Bandwidth', front: 'AM double-sideband bandwidth', back: 'BW = 2 * f_m (modulating max freq)', difficulty: 'medium', tags: ['modulation'] },
    { id: 'fc-ece-011', branch: 'ECE', subject: 'Network Theory', topic: 'Nodal Analysis', front: 'Primary law used in nodal analysis', back: 'Kirchhoff’s Current Law (KCL)', difficulty: 'easy', tags: ['analysis'] },
    { id: 'fc-ece-012', branch: 'ECE', subject: 'Digital', topic: 'Flip-Flops', front: 'Edge triggered D flip-flop', back: 'Captures input on clock edge; common memory element.', difficulty: 'easy', tags: ['sequential'] },
    { id: 'fc-ece-013', branch: 'ECE', subject: 'Control Systems', topic: 'PID', front: 'Effect of derivative term', back: 'Improves transient response by predicting error trend.', difficulty: 'medium', tags: ['pid'] },
    { id: 'fc-ece-014', branch: 'ECE', subject: 'Analog', topic: 'Filter', front: 'First-order RC cutoff amplitude', back: 'At cutoff amplitude = 1/√2 of passband.', difficulty: 'medium', tags: ['filter'] },
    { id: 'fc-ece-015', branch: 'ECE', subject: 'EDC', topic: 'CMOS', front: 'Reason PMOS width > NMOS width', back: 'Electron mobility > hole mobility, so PMOS requires wider channel for matched drive.', difficulty: 'medium', tags: ['vlsi'] },
    { id: 'fc-ece-016', branch: 'ECE', subject: 'Signals & Systems', topic: 'Convolution', front: 'Time convolution property', back: 'Convolution in time → multiplication in frequency.', difficulty: 'medium', tags: ['transform'] },
    { id: 'fc-ece-017', branch: 'ECE', subject: 'Mathematics', topic: 'Series', front: 'p-series convergence test', back: 'Σ1/n^p converges if p > 1.', difficulty: 'medium', tags: ['calculus'] },
    { id: 'fc-ece-018', branch: 'ECE', subject: 'Communication', topic: 'SNR', front: 'Higher SNR implies...', back: 'Better signal quality and lower error rates.', difficulty: 'easy', tags: ['comm'] },
    { id: 'fc-ece-019', branch: 'ECE', subject: 'Network Theory', topic: 'Resonance', front: 'Series resonance behaviour', back: 'Impedance minimized and current maximized at resonance.', difficulty: 'medium', tags: ['resonance'] },
    { id: 'fc-ece-020', branch: 'ECE', subject: 'Apti', topic: 'Probability', front: 'Probability of two heads with two coins', back: '1/4', difficulty: 'easy', tags: ['aptitude'] }
  ],
  EE: [
    { id: 'fc-ee-001', branch: 'EE', subject: 'Power Systems', topic: 'Per Unit', front: 'Per unit value formula', back: 'p.u. = actual / base', difficulty: 'easy', tags: ['power'] },
    { id: 'fc-ee-002', branch: 'EE', subject: 'Machines', topic: 'Transformer', front: 'Transformer rated in', back: 'kVA (apparent power)', difficulty: 'easy', tags: ['machines'] },
    { id: 'fc-ee-003', branch: 'EE', subject: 'Power Electronics', topic: 'Inverter', front: 'Purpose of PWM', back: 'Shape output waveform and reduce harmonics', difficulty: 'medium', tags: ['power electronics'] },
    { id: 'fc-ee-004', branch: 'EE', subject: 'Protection', topic: 'Relay', front: 'Overcurrent relay function', back: 'Detects excessive current and isolates fault', difficulty: 'easy', tags: ['protection'] },
    { id: 'fc-ee-005', branch: 'EE', subject: 'Control', topic: 'PID', front: 'I term effect', back: 'Reduces steady-state error', difficulty: 'easy', tags: ['control'] },
    { id: 'fc-ee-006', branch: 'EE', subject: 'Power Systems', topic: 'Load Flow', front: 'Load flow computes', back: 'Bus voltages and angles under steady state', difficulty: 'medium', tags: ['analysis'] },
    { id: 'fc-ee-007', branch: 'EE', subject: 'Machines', topic: 'Induction Motor', front: 'Slip definition', back: 's = (Ns - N)/Ns', difficulty: 'medium', tags: ['machines'] },
    { id: 'fc-ee-008', branch: 'EE', subject: 'Transmission', topic: 'Corona', front: 'Corona related to', back: 'High voltages and sharp conductors', difficulty: 'medium', tags: ['lines'] },
    { id: 'fc-ee-009', branch: 'EE', subject: 'Power Electronics', topic: 'Rectifier', front: 'Controlled rectifier key device', back: 'Thyristor (SCR)', difficulty: 'medium', tags: ['pe'] },
    { id: 'fc-ee-010', branch: 'EE', subject: 'Protection', topic: 'Relays', front: 'Inverse time relays operate', back: 'Faster for higher fault currents', difficulty: 'medium', tags: ['relays'] },
    { id: 'fc-ee-011', branch: 'EE', subject: 'Control', topic: 'State Space', front: 'State space models are for', back: 'Time domain analysis of MIMO systems', difficulty: 'medium', tags: ['theory'] },
    { id: 'fc-ee-012', branch: 'EE', subject: 'Power Systems', topic: 'Stability', front: 'Transient stability studies', back: 'Rotor angle behaviour after large disturbances', difficulty: 'hard', tags: ['stability'] },
    { id: 'fc-ee-013', branch: 'EE', subject: 'Machines', topic: 'Synchronous', front: 'Synchronous machine excitation affects', back: 'Terminal voltage and reactive power', difficulty: 'medium', tags: ['machines'] },
    { id: 'fc-ee-014', branch: 'EE', subject: 'Power Electronics', topic: 'Chopper', front: 'Chopper application', back: 'DC-DC conversion', difficulty: 'medium', tags: ['conversion'] },
    { id: 'fc-ee-015', branch: 'EE', subject: 'Transmission', topic: 'Line Charging', front: 'Effect of shunt capacitance', back: 'Charging current flows causing voltage rise', difficulty: 'medium', tags: ['lines'] },
    { id: 'fc-ee-016', branch: 'EE', subject: 'Machines', topic: 'Torque', front: 'Electromagnetic torque proportional to', back: 'Flux × Current', difficulty: 'medium', tags: ['machines'] },
    { id: 'fc-ee-017', branch: 'EE', subject: 'Power Systems', topic: 'Symmetrical components', front: 'Positive sequence used for', back: 'Balanced system analysis and fault studies', difficulty: 'medium', tags: ['symmetry'] },
    { id: 'fc-ee-018', branch: 'EE', subject: 'Power Electronics', topic: 'Inverter', front: 'H-bridge is used in', back: 'Single-phase full-bridge inverter topologies', difficulty: 'medium', tags: ['topology'] },
    { id: 'fc-ee-019', branch: 'EE', subject: 'Protection', topic: 'Fuse', front: 'Fuse function', back: 'Protect circuits against overcurrent by melting', difficulty: 'easy', tags: ['safety'] },
    { id: 'fc-ee-020', branch: 'EE', subject: 'Control', topic: 'Bode', front: 'Gain margin indicates', back: 'How much gain can increase before instability', difficulty: 'medium', tags: ['stability'] }
  ],
  CSE: [
    { id: 'fc-cse-001', branch: 'CSE', subject: 'Algorithms', topic: 'Binary Search', front: 'Time complexity of binary search', back: 'O(log n)', difficulty: 'easy', tags: ['search'] },
    { id: 'fc-cse-002', branch: 'CSE', subject: 'Data Structures', topic: 'Hashing', front: 'Separate chaining collision resolution', back: 'Each bucket holds a list of entries', difficulty: 'medium', tags: ['hash'] },
    { id: 'fc-cse-003', branch: 'CSE', subject: 'Operating Systems', topic: 'Processes', front: 'Context switch cost', back: 'Overhead due to saving/restoring registers and memory context', difficulty: 'medium', tags: ['os'] },
    { id: 'fc-cse-004', branch: 'CSE', subject: 'Databases', topic: 'Normalization', front: 'Purpose of normalization', back: 'Reduce redundancy and update anomalies', difficulty: 'easy', tags: ['db'] },
    { id: 'fc-cse-005', branch: 'CSE', subject: 'Networks', topic: 'TCP', front: 'TCP provides', back: 'Reliable byte-stream service with retransmission', difficulty: 'medium', tags: ['net'] },
    { id: 'fc-cse-006', branch: 'CSE', subject: 'Algorithms', topic: 'Dynamic Programming', front: 'Memoization benefit', back: 'Avoid redundant computations by caching results', difficulty: 'medium', tags: ['dp'] },
    { id: 'fc-cse-007', branch: 'CSE', subject: 'Data Structures', topic: 'Heap', front: 'Use-case for heap', back: 'Priority queue implementation', difficulty: 'easy', tags: ['heap'] },
    { id: 'fc-cse-008', branch: 'CSE', subject: 'OS', topic: 'Deadlock', front: 'Deadlock necessary condition', back: 'Mutual exclusion, hold-and-wait, no preemption, circular wait', difficulty: 'medium', tags: ['os'] },
    { id: 'fc-cse-009', branch: 'CSE', subject: 'Databases', topic: 'Transactions', front: 'ACID stands for', back: 'Atomicity, Consistency, Isolation, Durability', difficulty: 'easy', tags: ['db'] },
    { id: 'fc-cse-010', branch: 'CSE', subject: 'Networks', topic: 'Routing', front: 'OSPF is', back: 'A link-state routing protocol', difficulty: 'medium', tags: ['routing'] },
    { id: 'fc-cse-011', branch: 'CSE', subject: 'Algorithms', topic: 'Graphs', front: 'Dijkstra requires', back: 'Non-negative edge weights', difficulty: 'medium', tags: ['graphs'] },
    { id: 'fc-cse-012', branch: 'CSE', subject: 'Data Structures', topic: 'Trees', front: 'AVL tree property', back: 'Balance factor of every node is -1,0 or 1', difficulty: 'medium', tags: ['trees'] },
    { id: 'fc-cse-013', branch: 'CSE', subject: 'OS', topic: 'Scheduling', front: 'Round Robin scheduling favors', back: 'Fairness among processes with time slices', difficulty: 'easy', tags: ['scheduling'] },
    { id: 'fc-cse-014', branch: 'CSE', subject: 'Databases', topic: 'Index', front: 'B-tree supports', back: 'Efficient range queries and ordered traversal', difficulty: 'easy', tags: ['index'] },
    { id: 'fc-cse-015', branch: 'CSE', subject: 'Networks', topic: 'MAC', front: 'CSMA/CD used in', back: 'Ethernet shared-medium environment', difficulty: 'medium', tags: ['mac'] },
    { id: 'fc-cse-016', branch: 'CSE', subject: 'Algorithms', topic: 'Greedy', front: 'Greedy choice property means', back: 'Local optimal choice leads to global optimum', difficulty: 'medium', tags: ['greedy'] },
    { id: 'fc-cse-017', branch: 'CSE', subject: 'Data Structures', topic: 'Graph Algorithms', front: 'Topological sort applies to', back: 'Directed acyclic graphs (DAGs)', difficulty: 'medium', tags: ['graphs'] },
    { id: 'fc-cse-018', branch: 'CSE', subject: 'OS', topic: 'Synchronization', front: 'Semaphore types', back: 'Binary and counting semaphores', difficulty: 'medium', tags: ['sync'] },
    { id: 'fc-cse-019', branch: 'CSE', subject: 'Databases', topic: 'Query Optimization', front: 'Cost-based optimizer uses', back: 'Statistics and cost models to choose plan', difficulty: 'hard', tags: ['db'] },
    { id: 'fc-cse-020', branch: 'CSE', subject: 'Algorithms', topic: 'Complexity', front: 'P vs NP informal', back: 'P is problems solvable in polynomial time; NP is verifiable in polynomial time', difficulty: 'hard', tags: ['complexity'] }
  ]
};

export default flashcardsData;
