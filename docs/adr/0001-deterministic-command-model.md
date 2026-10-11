# One deterministic command boundary

The journey model owns all resource changes, random draws and terminal-state rules, independently of the DOM. A stored PRNG state makes save/resume and replay reproducible; commands produce new states and rejected commands preserve the previous state atomically. A looser UI-driven model would be quicker initially but makes repeated event rewards and invalid purchases difficult to prevent and test.
