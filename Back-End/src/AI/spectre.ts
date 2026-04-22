import { AIProvider, IAIProvider } from "./providers/provider";
import { AISuggestion } from "@cv/types";
import { GeminiAIProvider } from "./providers/gemini";
import { env } from "../config/env";

// const apiKey = env.GEMINI_API_KEY;
// console.log("apiKey: ", apiKey)


// class LocalOllamaAIProvider extends AIProvider implements IAIProvider {
//   constructor() {
//     super();
//   }
//   async suggest(tokens: string): Promise<AISuggestion> {
//     const response = await fetch('http://localhost:11434/v1', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ tokens }),
//     });
//     const data = await response.json();
//     return data as AISuggestion;
//   }
// }

// const ai = new GeminiAIProvider(apiKey!);


// const mydata = `
// Saif Omar
// Backend Developer
// Shbein El Kom, Menoufia — saifelyasv@gmail.com — github.com/SaifOmar — +20 100 004 9956
// PROFESSIONAL SUMMARY
// Backend-focused developer with hands-on experience building scalable systems using Laravel, Django REST Frame-
// work, and Golang. Strong background in REST APIs, real-time systems, payments, delivery logistics, and WebSocket-
// based multiplayer communication. Actively builds developer tooling, including custom Neovim plugins, with a focus
// on clean architecture, performance, and maintainability.
// TECHNICAL SKILLS
// • Backend: PHP (Laravel), Python (Django, Django REST Framework), Golang
// • Technologies and frameworks: Django, Django REST Framework, Laravel, Golang, WebSockets, Node.js, Ex-
// press.js, Stripe, Paymob
// • Tools: Git, GitHub, REST API design, Neovim, SQLite, MySQL
// PROJECTS
// Goby2 (Freelance, Django)
// Food delivery platform similar to Uber Eats.
// goby2.com
// • Architected a multi-user ecosystem handling distinct workflows for customers, deliverymen, and restaurant managers.
// • Integrated Stripe and Stripe-Connect to automate split payments and payouts between platform and vendors.
// • Developed geospatial calculations to filter order availability based on courier proximity and range.
// • Implemented location tracking (polling) to provide real-time courier updates on the mobile app.
// GeniusEg (Freelance, Laravel)
// geniuseg.com
// • Re-engineered a legacy native PHP codebase into a modern, maintainable Laravel architecture.
// • Integrated Paymob payment gateway and developed secure webhooks for transaction verification.
// • Built a dynamic admin dashboard using Filament to manage course content, user subscriptions, and analytics.
// NSP Space (Freelance, Laravel)
// nspspace.com
// • Designed the database schema and backend logic for a comprehensive event and course management system.
// • Optimized high-traffic database queries using eager loading and proper indexing to improve load times.
// LocalPulse (Laravel)
// GitHub
// • Developed a location-based social API allowing users to discover and interact with posts in specific geofences.
// • Implemented Laravel Jobs and Queues to offload image processing and notification dispatching, ensuring non-blocking
// API responses.
// • Designed RESTful endpoints utilizing Laravel Resources for consistent JSON API responses.
// Werewolf Multiplayer Game (TypeScript)
// Werewolf
// • Engineered an event-driven WebSocket server managing concurrent game rooms and real-time state transitions.
// • Implemented complex game loop logic including role distribution, voting phases, and timer synchronization.
// • Handled edge cases such as player disconnections and reconnections to maintain game state integrity and much more.
// ITT Helper (Django, DRF)
// GitHub
// • Built a hybrid architecture serving both server-side rendered templates and a REST API for mobile consumption.
// • Implemented Role-Based Access Control (RBAC) to differentiate between students, advisors, and administrators.
// Menace Tournament Engine (Golang)
// • Developed a tournament simulation engine to explore and learn basic Go programming.
// EDUCATION
// Bachelor of Information Technology — Egyptian E-Learning University (EELU)
// Graduated: 2025
// `
// const data = ai.suggest(mydata)
// console.log("Ai: ", ai)
// console.log("Data : ", data)

// save my data to a json file
// fs.writeFileSync("mydata.json", JSON.stringify(data, null, 2));








// export { ai }


