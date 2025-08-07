import fs from "fs";
import path from "path";
import { TEST_LOGS_DIR } from "../constants";

const projects = [
	"ecommerce-platform",
	"task-management-app",
	"blog-cms",
	"social-media-dashboard",
	"portfolio-website",
	"api-gateway",
	"user-authentication-service",
	"payment-processing-system",
	"real-time-chat-app",
	"file-upload-service",
];

const templates = [
	"Bug",
	"Feature",
	"Learning",
	"Work",
	"Research",
	"Optimization",
	"Security",
	"Deployment",
	"Testing",
	"Documentation",
];

const frontendTopics = [
	"React hooks optimization",
	"Vue.js composition API",
	"Angular state management",
	"CSS Grid layouts",
	"Responsive design",
	"Web accessibility",
	"Performance optimization",
	"State management (Redux/Zustand)",
	"TypeScript integration",
	"Component testing",
	"Bundle optimization",
	"PWA implementation",
	"SEO optimization",
	"Error boundaries",
	"Code splitting",
	"Lazy loading",
	"Service workers",
	"Web animations",
];

const backendTopics = [
	"API design patterns",
	"Database optimization",
	"Authentication & authorization",
	"Rate limiting",
	"Caching strategies",
	"Error handling",
	"Logging & monitoring",
	"Security best practices",
	"Microservices architecture",
	"Message queues",
	"GraphQL implementation",
	"RESTful API design",
	"Database migrations",
	"Background jobs",
	"File upload handling",
	"Email services",
	"Payment integration",
	"Real-time features",
	"Data validation",
];

const devopsTopics = [
	"Docker containerization",
	"CI/CD pipelines",
	"Kubernetes deployment",
	"AWS services",
	"Monitoring & alerting",
	"Load balancing",
	"Auto-scaling",
	"Database backups",
	"SSL certificates",
	"Domain management",
	"CDN setup",
	"Environment management",
	"Infrastructure as code",
	"Security scanning",
	"Performance testing",
	"Disaster recovery",
	"Blue-green deployment",
];

const bugDescriptions = [
	"Fixed memory leak in component lifecycle",
	"Resolved CORS issue with API endpoints",
	"Fixed authentication token expiration",
	"Patched SQL injection vulnerability",
	"Resolved race condition in async operations",
	"Fixed responsive layout breakpoints",
	"Corrected timezone handling in date picker",
	"Fixed infinite loop in recursive function",
	"Resolved state synchronization issue",
	"Patched XSS vulnerability in user input",
];

const featureDescriptions = [
	"Implemented user authentication system",
	"Added real-time notifications",
	"Built admin dashboard interface",
	"Created API rate limiting",
	"Implemented file upload functionality",
	"Added search and filtering",
	"Built reporting and analytics",
	"Created mobile responsive design",
	"Implemented payment processing",
	"Added data export functionality",
];

const learningDescriptions = [
	"Studied advanced React patterns",
	"Learned about microservices architecture",
	"Explored GraphQL vs REST",
	"Researched performance optimization techniques",
	"Studied security best practices",
	"Learned about container orchestration",
	"Explored serverless architecture",
	"Studied database design patterns",
	"Learned about testing strategies",
	"Researched monitoring and observability",
];

function getRandomItem<T>(array: T[]): T {
	if (array.length === 0) {
		throw new Error("Array must not be empty");
	}
	return array[Math.floor(Math.random() * array.length)] as T;
}

function getRandomDate(): string {
	const start = new Date(20, 0, 1);
	const end = new Date();
	const randomDate = new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	);
	return randomDate.toISOString();
}

function generateContent(template: string): string {
	switch (template) {
		case "Bug":
			return getRandomItem(bugDescriptions);
		case "Feature":
			return getRandomItem(featureDescriptions);
		case "Learning":
			return getRandomItem(learningDescriptions);
		default:
			return `Working on ${getRandomItem([...frontendTopics, ...backendTopics, ...devopsTopics])}`;
	}
}

function generateTags(template: string): string {
	const allTags = [
		"react",
		"vue",
		"angular",
		"nodejs",
		"python",
		"java",
		"typescript",
		"javascript",
		"docker",
		"kubernetes",
		"aws",
		"azure",
		"gcp",
		"postgresql",
		"mongodb",
		"redis",
		"graphql",
		"rest",
		"microservices",
		"testing",
		"ci-cd",
		"security",
		"performance",
		"frontend",
		"backend",
		"devops",
		"database",
		"api",
		"authentication",
		"deployment",
	];

	const numTags = Math.floor(Math.random() * 4) + 1; // 1-4 tags
	const selectedTags: string[] = [];

	for (let i = 0; i < numTags; i++) {
		const tag = getRandomItem(allTags);
		if (!selectedTags.includes(tag)) {
			selectedTags.push(tag);
		}
	}

	return selectedTags.join(", ");
}

function generateNote(): {
	date: string;
	project: string;
	template: string;
	heading: string;
	content: string;
	tags: string;
} {
	const date = getRandomDate();
	const project = getRandomItem(projects);
	const template = getRandomItem(templates);
	const content = generateContent(template);
	const tags = generateTags(template);

	// Generate a realistic heading based on template and content
	let heading = "";
	switch (template) {
		case "Bug":
			heading = `Fix: ${content.split(" ").slice(0, 4).join(" ")}`;
			break;
		case "Feature":
			heading = `Add: ${content.split(" ").slice(0, 4).join(" ")}`;
			break;
		case "Learning":
			heading = `Learn: ${content.split(" ").slice(0, 4).join(" ")}`;
			break;
		default:
			heading = `${template}: ${content.split(" ").slice(0, 4).join(" ")}`;
	}

	return { date, project, template, heading, content, tags };
}

function generateTestData() {
	console.log("Generating 500 test notes...");

	// Ensure logs directory exists
	if (!fs.existsSync(TEST_LOGS_DIR)) {
		fs.mkdirSync(TEST_LOGS_DIR, { recursive: true });
	}

	for (let i = 1; i <= 500; i++) {
		const note = generateNote();
		const filename = `${note.date.replace(/[:.]/g, "-")}_${note.heading.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "")}.md`;
		const filepath = path.join(TEST_LOGS_DIR, filename);

		const frontmatter = `---
date: ${note.date}
project: ${note.project}
template: ${note.template}
tags: [${note.tags
			.split(",")
			.map((t) => t.trim())
			.join(", ")}]
---

# ${note.heading}

${note.content}

## Details

This note was generated for testing purposes. It contains realistic full-stack development content including:

- **Frontend**: ${getRandomItem(frontendTopics)}
- **Backend**: ${getRandomItem(backendTopics)}
- **DevOps**: ${getRandomItem(devopsTopics)}

## Additional Context

Generated on: ${new Date().toISOString()}
Note ID: ${i}/500
`;

		fs.writeFileSync(filepath, frontmatter, "utf-8");

		if (i % 50 === 0) {
			console.log(`Generated ${i}/500 notes...`);
		}
	}

	console.log("✅ Successfully generated 500 test notes!");
	console.log(`�� Files saved to: ${TEST_LOGS_DIR}`);
}

// Run the generator
generateTestData();
