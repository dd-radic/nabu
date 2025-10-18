<!DOCTYPE html>
<html lang="en">
<head>
	<title>Vision Document</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<!DOCTYPE html>
<body>
	<h1>Vision Document</h1>
	<h1>1. Introduction</h1>
	<p> Learning is often more effective when it feels like play. Many educational apps use quizzes,but these can become repetitive and boring. A learning app with interactive puzzles and gamification can improve engagement while reinforcing knowledge. This project focuses on developing a mobile/web application that delivers various puzzle-based learning activities with progress tracking and rewards. The emphasis is on app development (frontend + backend), user experience, and gamification mechanics.</p>
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
	<p> Gamification has been shown in numerous studies to have an incentivizing effect toward continued - even habitual - use of software products. </p>
	<p> This element has been leveraged by numerous previous learning productivity products e.g. Kahoot, Duolingo, Quizlet, Khan Academy. Nabu aims toward a similar goal, with the most analogous example being Kahoot, however Nabu aims to include more explicitly gamified elements for users e.g. Duolingo.</p> <p>This broader and deeper presence of gamified elements will drive continued and repetitive use by prospective users.</p>
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
	<p> The primary goal of the development team is to produce a usable learning app with gamified elements, focusing on functionality and aesthetic appeal. </p>
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
	<p>There are several groups of target users: lecturers, students, and independent learners. 
	Lecturers will be working alone to develop supplementary learning materials in the app. These learning materials will then be distributed to the students in their class so they can interact with the app, thus helping their learning. These lecturers will most likely want to set up private classrooms for their students to participate in. </p>
	<p>Today, teachers commonly use apps like Kahoot or Quizlet to promote learning among their class through academic competition. 
	Students will be working in groups to participate in games organized by the lecturers, or on their own to develop independent learning materials such as flashcards or quizzes. The students could be the end user for material developed by the lecturer or the end user of material they developed themselves. </p>
	<p>Students will most likely want to create public classrooms where they can share material they have created with their peers.
	Independent learners are effectively students for the purpose of creating learning materials for themselves. These learners will also want to search for learning materials available on the app's public classrooms. 
	</p>
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
			<td>JavaScript</td>
			<td>High</td>
			<td>Primary development language</td>
			<td>N/A (Const.)</td>
		</tr>
		<tr>
			<td>React.js</td>           
			<td>High</td>
			<td>Frontend</td>
			<td>Incr1 or Incr2</td>
		</tr>
		<tr>
			<td>Node.js</td>
			<td>High</td>
			<td>Backend</td>
			<td>Incr1</td>
		</tr>
		<tr>
			<td>SQL</td>
			<td>High</td>
			<td>Database</td>
			<td>Incr1</td>
		</tr>
		<tr>
			<td>GitHub repository</td>
			<td>High</td>
			<td>Internal Version Control</td>
			<td>ORG</td>
		</tr>
			<td>Jira</td>
			<td>High</td>
			<td>Scrum</td>
			<td>ORG</td>
		</tr>
		<tr>
			<td>Additional Scripting Languages</td>
			<td>Low</td>
			<td>Feature Development</td>
			<td>Where Applicable, starting with Incr2</td>
		</tr>
		<tr>
			<td>Mobile Application</td>
			<td>Low</td>
			<td>Accompaniment to WebApp</td>
			<td>Roadmap</td>
		</tr>
	</table>
	<br>
	<h2>4.2 Other Product Requirements</h2>
	<table>
		<tr>
			<th>Requirement</th>
			<th>Priority</th>
			<th>Planned Release</th>
		</tr>
		<tr>
			<td>Legal Compliance</td>
			<td>High</td>
			<td>N/A (Const.)</td>
		</tr>
		<tr>
			<td>Regulatory Compliance</td>
			<td>High</td>
			<td>N/A (Const.)</td>
		</tr>
		<tr>
			<td>Availability</td>
			<td>High</td>
			<td>Roadmap</td>
		</tr>
		<tr>
			<td>Creative Direction</td>
			<td>Medium</td>
			<td>Starting Incr1</td>
		</tr>
		<tr>
			<td>Usability</td>
			<td>High</td>
			<td>Starting Incr1</td>
		</tr>
		<tr>
			<td>UI Design</td>
			<td>Medium</td>
			<td>Starting Incr2</td>
		</tr>
	</table>
	<br>
	<p>As the product will broadly handle data from private persons it is paramount to ensure compliance with laws, regulations, standards and best practices pertaining to secure coding, cybersecurity, data integrity, server stability and availability.</p>
	<p>A sleek design and art direction combined with usbility will underpin and reinforce the gamified aesthetic of the final product. </p>
	<p>©Nabu UG (2025)</p>
</body>

