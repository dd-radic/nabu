<!DOCTYPE html>
<html lang="en">
<head>
	<title>Vision Document</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
	<h1>1. Introduction</h1>
	<p> Learning is often more effective when it feels like play. Many educational apps use quizzes,
but these can become repetitive and boring. A learning app with interactive puzzles and
gamification can improve engagement while reinforcing knowledge.
This project focuses on developing a mobile/web application that delivers various puzzle-
based learning activities with progress tracking and rewards. The emphasis is on app
development (frontend + backend), user experience, and gamification mechanics.</p>
	<h1>2. Positioning</h1>
	<h2>2.1 Problem Statement</h2>
	<table>
		<tr>
			<th>Problem</th>
			<td>Disorganized learning materials and exercises in learning environments<br>Existing classroom learning/exercise structure sometimes demotivating</td>
		</tr>
		<tr>
			<th>Affects</th>
			<td>Lecturers and students in learning environments</td>
		</tr>
		<tr>
			<th>Impact</th>
			<td>For lecturers: increased workload (difficulty revising material, manually grading exercises, organizing documents)
			<br>For students: low learning enthusiasm and ensuing suboptimal performance, difficulty estimating progress</td>
		</tr>
		<tr>
			<th>Solution</th>
			<td>Customizable, user-friendly gamified learning platform</td>
		</tr>
	</table>
	<br>

	<h2>2.2 Product Position Statement</h2>
	<table>
		<tr>
			<th>Target Demographic(s)</th>
			<td>Lecturers and students in learning environments</td>
		</tr>
		<tr>
			<th>Target Demand</th>
			<td>Learning materials easy to revise and update<br>Engaging learning exercises<br>Track learning progress</td>
		</tr>
		<tr>
			<th>Product Category</th>
			<td>Gamified learning platform</td>
		</tr>
		<tr>
			<th>Benefit</th>
			<td>Standardized learning materials (e.g. flashcards, presentations, digital exercises)<br>Gamified learning exercises drive enthusiasm and engagement<br>Progress tracking helps organize study priority, e.g. finding points of struggle</td>
		</tr>
		<tr>
			<th>Primary Market Alternative</th>
			<td>Kahoot</td>
		</tr>
		<tr>
			<th>Primary Differentiation</th>
			<td>Gamification scope</td>
		</tr>
	</table>
	<br>
	<p> [TODO explain theoretical benefit of gamification, compare similarities and differences with Kahoot <br>
	Maybe also mention other similar sites/apps e.g. khan academy, duolingo, moodle<br>
	Also elaborate on "gamification scope"] </p>
	<p><em>[A product position statement communicates the intent of the application and the importance of the project to all concerned personnel.]</em></p>
	<p><em>[Provide an overall statement summarizing, at the highest level, the unique position the product intends to fill in the marketplace. The following format may be used:]</em></p>
	<h1>3. Stakeholder Descriptions</h1>
	<h2>3.1 Stakeholder Summary</h2>
	<h3>3.1.1 Internal Stakeholders</h3>
	<table>
		<tr>
			<th>Name</th>
			<th>Description</th>
			<th>Responsibilities</th>
		</tr>
		<tr>
			<td>Project Lead</td>
			<td>Overall project coordinator</td>
			<td>Project planning and scheduling<br>
			Production documentation<br>
			Production timeline development<br>
			Rresource and risk management<br>
			Task allocation<br>
			Team coordination<br>
			Stakeholder communication</td>
		</tr>
		<tr>
			<td>Software Architect</td>
			<td>Technical structure designer</td>
			<td>Technical architecture design<br>
			Technical documentation<br>
			Technology selection<br>
			Technical guidance<br>
			Code standardization and review</td>
		</tr>
		<tr>
			<td>Quality Manager</td>
			<td>Quality assurance officer</td>
			<td>QA strategy coordinator<br>
			Test planning<br>
			Bug fixing priority coordinator<br>
			Performance testing<br>
			Compliance audit<br>
			Continuous improvement<br>
			User feedback</td>
		</tr>
		<tr>
			<td>Developers</td>
			<td>Development team members</td>
			<td>Feature development<br>
			Coding and implementation<br>
			Version control<br>
			Bug hunting and fixing<br>
			Team cooperation<br>
			General documentation</td>
		</tr>
	</table>
	<br> 
	<p> The goal of the development team is to produce a usable learning app with gameified elements. </p>
	<h3>3.1.2 External Stakeholders</h3>
	<table>
		<tr>
			<th>Name</th>
			<th>Description</th>
			<th>Use-Case</th>
		</tr>
		<tr>
			<td>Lecturers</td>
			<td>Instructors in classroom settings and learning environments</td>
			<td>Classroom supplement<br>
			Create/manage repositories<br>
			Organize lecturing materials<br>
			Create exercises for students<br>
			Track student progress</td>
		</tr>
		<tr>
			<td>Students</td>
			<td>Learners in classroom settings and learning environments</td>
			<td>Interaction (use repositories)<br>
			Utilize lecturing materials<br>
			Supplement personal notes <br>
			Complete gamified exercises <br>
			Build enthusiasm <br>
			Track/compare own progress</td>
		</tr>
		<tr>
			<td>Independent instructors/ Hobbyists</td>
			<td>Hobbyists or other independent instructors</td>
			<td>Create/manage repositories <br>
			Documentation<br>
			Drive interest in a subject <br>
			Free exchange of information <br>
			Build independent learning community</td>
		</tr>
		<tr>
			<td>Independent learners</td>
			<td>Amateurs or other individuals seeking independent learning</td>
			<td>Interaction (use repositories)<br>
			Pursue independent learning <br>
			Utilize information repositories <br>
			Build enthusiasm for a topic <br>
			Compete with other amateurs <br>
			Track personal progress</td>
		</tr>
		<tr>
			<td>Investors</td>
			<td>Outside investors financing development</td>
			<td>ROI <br>
			Influence development <br>
			Support userbase growth</td>
		</tr>
	</table>
	<br> 
	<h2>3.2 User Environment</h2>
	<br>
	<p><em>There are several groups of target users: lecturers, students, and independent learners. 
	Lecturers will be working alone to develop supplementary learning materials in the app. These learning materials will then be distributed to the students in their class so they can interact with the app, thus helping their learning. These lecturers will most likely want to set up private classrooms for their students to participate in. Today, teachers commonly use apps like Kahoot or Quizlet to promote learning among their class through academic competition. 
	Students will be working in groups to participate in games organized by the lecturers, or on their own to develop independent learning materials such as flashcards or quizzes. The students could be the end user for material developed by the lecturer or the end user of material they developed themselves. Students will most likely want to create public classrooms where they can share material they have created with their peers.
	Independent learners are effectively students for the purpose of creating learning materials for themselves. These learners will also want to search for learning materials available on the app's public classrooms. 
	</em></p>
	<h1>4. Product Overview</h1>
	<h2>4.1 Needs and Features</h2>
	<table>
		<tr>
			<th>Need</th>
			<th>Priority</th>
			<th>Features</th>
			<th>Planned Release</th>
		</tr>
		<tr>
			<td>Top Level Domain</td>
			<td>High</td>
			<td>TODO</td>
			<td>TODO</td>
		</tr>
		<tr>
			<td>React.js</td>           
			<td>High</td>
			<td>Frontend</td>
			<td>TODO</td>
		</tr>
		<tr>
			<td>Node.js</td>
			<td>High</td>
			<td>Backend</td>
			<td>TODO</td>
		</tr>
		<tr>
			<td>SQL</td>
			<td>High</td>
			<td>Database</td>
			<td>TODO</td>
		</tr>
		<tr>
			<td>GitHub repository</td>
			<td>High</td>
			<td>Internal Version Control</td>
			<td>TODO</td>
		</tr>
		<tr>
			<td>TODO (Lua/PHP)?</td>
			<td>Low</td>
			<td>Additional Scripting</td>
			<td>TODO</td>
		</tr>
		<tr>
			<td>Mobile Application</td>
			<td>Low</td>
			<td>TODO</td>
			<td>Roadmap</td>
		</tr>
	</table>
	<br>
	<p> [TODO justify choices, figure out releases] </p>
	<p><em>[Avoid design. Keep feature descriptions at a general level. Focus on capabilities needed and why (not how) they should be implemented. Capture the stakeholder priority and planned release for each feature.]</em></p>
	<h2>4.2 Other Product Requirements</h2>
	<table>
		<tr>
			<th>Requirement</th>
			<th>Priority</th>
			<th>Planned Release</th>
		</tr>
		<tr>
			<td>Information Security (ISO 27001)</td>
			<td>High</td>
			<td>TODO</td>
		</tr>
		<tr>
			<td>Data Privacy (GDPR, ISO 27701)</td>
			<td>High</td>
			<td>TODO</td>
		</tr>
		<tr>
			<td>Comply with relevant laws and standards (???)</td>
			<td>High</td>
			<td>TODO</td>
		</tr>
		<tr>
			<td>TODO: Find additional requirements</td>
			<td>TODO</td>
			<td>TODO</td>
		</tr>
		<tr>
			<td>.</td>
			<td></td>
			<td></td>
		</tr>
		<tr>
			<td>.</td>
			<td>.</td>
			<td>.</td>
		</tr>
		<tr>
			<td>.</td>
			<td>.</td>
			<td>.</td>
		</tr>
		<tr>
			<td>.</td>
			<td>.</td>
			<td>.</td>
		</tr>
	</table>
	<br>
	<p> [TODO elaborate (see below paragraph)] </p>
	<p><em>[At a high level, list applicable standards, hardware, or platform requirements; performance requirements; and environmental requirements. Define the quality ranges for performance, robustness, fault tolerance, usability, and similar characteristics that are not captured in the Feature Set.]</em></p>
	<br>
	<p>©Nabu UG (2025)</p>
</body>

