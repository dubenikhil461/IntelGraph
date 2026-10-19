import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from '@langchain/core/output_parsers';

console.log("Current directory:", process.cwd());
console.log("API key loaded:", Boolean(process.env.GOOGLE_API_KEY));

const model = new ChatGoogleGenerativeAI({
    model: "gemini-3.8-flash",
    temperature: 0,
});

const information = `
  The kernel is the core component of an operating system that acts as the primary interface between a computer's physical hardware and its software processes. It remains loaded in the main memory from the moment the system boots up until it shuts down.
## Core Definition and Role

* Kernel definition: It is the central master program of an operating system.
* Boot loading: It loads into memory first during the system boot sequence.
* Hardware abstraction: It hides complex hardware details from application software.
* Resource management: It controls how system resources are allocated to programs.
* Bridge role: It acts as a middleman between software and hardware components.
* Privileged access: It executes tasks with the highest level of system privileges.
* Continuous execution: It runs constantly in the background until system shutdown.
* System integrity: It prevents user applications from crashing the entire computer.
* Control center: It governs all critical low-level operations of the machine.
* Foundational layer: It serves as the base upon which all software runs.

## Main Functions and Responsibilities

* Process management: It schedules which programs get CPU time and when.
* Memory management: It tracks and allocates virtual and physical RAM spaces.
* Device management: It communicates with peripherals using specialized device drivers.
* File systems: It manages how data is stored, read, and organized.
* System calls: It provides a secure interface for apps to request hardware tasks.
* Interrupt handling: It responds quickly to hardware signals needing immediate attention.
* Security enforcement: It restricts unauthorized access to protected system resources.
* I/O communication: It coordinates data flow between input and output devices.
* Task switching: It switches rapidly between tasks to enable seamless multitasking.
* Error handling: It catches and manages hardware and software execution faults.

## Types of Kernels

* Monolithic kernels: They run all core operating system services in one space.
* Microkernels: They keep only bare minimum services in the core space.
* Hybrid kernels: They combine the speed of monolithic with microkernel modularity.
* Exokernels: Tel them to let applications access raw hardware directly.
* Nano kernels: They offer an extremely small footprint for tiny embedded devices.
* Linux architecture: It uses a highly successful modular monolithic design.
* Windows NT: It relies on a customized hybrid kernel architecture.
* macOS kernel: It is built on a hybrid design named XNU.
* Microkernel speed: They can suffer from performance lags due to heavy communication.
* Monolithic speed: They deliver superior performance but risk total system crashes.

## Kernel Space vs. User Space

* Memory division: It splits the system memory into two distinct zones.
* Kernel space: It reserves a highly protected memory area for core operations.
* User space: It isolates standard applications to run in restricted zones.
* Ring 0: It represents the highest CPU privilege level for the kernel.
* Ring 3: It represents the lowest privilege level where user apps execute.
* Crash containment: It ensures a user space crash won't kill the kernel.
* Context switching: It incurs performance overhead when moving between these spaces.
* Memory protection: It blocks user applications from writing directly to kernel memory.
* Security boundary: It maintains a strict wall to block malicious software damage.
* Privileged instructions: It restricts certain CPU commands strictly to kernel execution.

## Performance and Management

* Device drivers: They extend kernel capabilities to support new physical hardware.
* Monolithic modules: They allow dynamically loading drivers without restarting the system.
* Kernel panic: It signifies a critical unrecoverable error that halts operations.
* Blue screen: It displays Windows' reaction to a fatal kernel-level error.
* Performance tuning: It optimizes memory usage and process scheduling efficiency.
* Scalability: It adapts resource management across single-core or multi-core CPUs.
* Virtualization: It allows multiple guest kernels to run on a host hypervisor.
* Real-time kernels: They guarantee execution of critical tasks within precise deadlines.
* Open source: It allows developers worldwide to audit and improve Linux kernels.
* Firmware updates: They frequently patch kernel vulnerabilities to maintain modern security.
`

const summary_template = `
  given the information ${information}. i want to you to create a
  1. A short Summary.
  2. intresting fact about it 
`

const summaryPrompt = new PromptTemplate({
  inputVariables :["information"],
  template : summary_template
})

const chain = summaryPrompt.pipe(model).pipe(new StringOutputParser());


const result = await chain.invoke({information});

console.log(result);
