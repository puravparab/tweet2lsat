import { LsatQuestionData, LsatResponse } from "../types/types";

export function createQuestionContainer(question: LsatQuestionData): HTMLDivElement {
  // Create main container
  const container = document.createElement('div');
  container.className = 'lsat-question-container';
  container.style.cssText = `
    padding: 12px 16px;
    margin: 12px 0;
    background-color: rgb(22, 24, 28);
    border-radius: 16px;
    color: rgb(231, 233, 234);
		font-family = 'system-ui, -apple-system, sans-serif';
  `;

  // Add question text
  const questionText = document.createElement('p');
  questionText.textContent = question.questionStem;
  questionText.style.cssText = `
    margin-bottom: 16px;
    font-size: 15px;
    line-height: 20px;
		font-family = 'system-ui, -apple-system, sans-serif';
  `;
  container.appendChild(questionText);

  // Create answers container
  const answersContainer = document.createElement('div');
  answersContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 12px;
		font-family = 'system-ui, -apple-system, sans-serif';
  `;

  // Add each answer choice
  question.answerChoices.forEach(choice => {
    const answerDiv = document.createElement('div');
    answerDiv.className = 'lsat-answer-choice';
    answerDiv.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
			font-family = 'system-ui, -apple-system, sans-serif';
    `;

    // Create radio button
    const radio = document.createElement('div');
    radio.className = 'answer-radio';
    radio.style.cssText = `
      width: 16px;
      height: 16px;
      border: 2px solid rgb(113, 118, 123);
      border-radius: 50%;
      flex-shrink: 0;
    `;

    // Add answer text
    const text = document.createElement('span');
    text.textContent = `${choice.letter}. ${choice.text}`;
    text.style.fontSize = '15px';

    answerDiv.appendChild(radio);
    answerDiv.appendChild(text);

    // Add click handler
    answerDiv.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();

      // Reset all answers
      answersContainer.querySelectorAll('.lsat-answer-choice').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '';
        const radioEl = el.querySelector('.answer-radio');
        if (radioEl) {
          (radioEl as HTMLElement).style.backgroundColor = '';
          (radioEl as HTMLElement).style.borderColor = 'rgb(113, 118, 123)';
        }
      });

      // Show result
      if (choice.isCorrect) {
        answerDiv.style.backgroundColor = 'rgba(0, 186, 124, 0.2)';
        radio.style.backgroundColor = 'rgb(0, 186, 124)';
        radio.style.borderColor = 'rgb(0, 186, 124)';
      } else {
        answerDiv.style.backgroundColor = 'rgba(244, 33, 46, 0.2)';
        radio.style.backgroundColor = 'rgb(244, 33, 46)';
        radio.style.borderColor = 'rgb(244, 33, 46)';
      }
    });

    // Add hover effect
    answerDiv.addEventListener('mouseenter', () => {
      if (!answerDiv.style.backgroundColor) {
        answerDiv.style.backgroundColor = 'rgba(239, 243, 244, 0.1)';
      }
    });

    answerDiv.addEventListener('mouseleave', () => {
      if (answerDiv.style.backgroundColor === 'rgba(239, 243, 244, 0.1)') {
        answerDiv.style.backgroundColor = '';
      }
    });

    answersContainer.appendChild(answerDiv);
  });

  container.appendChild(answersContainer);

	// Add repo link
	const repoLink = document.createElement('div');
	repoLink.style.cssText = `
		margin-top: 16px;
		text-align: center;
		font-size: 13px;
		color: rgb(113, 118, 123);
	`;
	
	const link = document.createElement('a');
	link.href = 'https://github.com/puravparab/tweet2lsat';
	link.target = '_blank';
	link.rel = 'noopener noreferrer';
	link.textContent = 'Powered by tweet2lsat';
	link.style.cssText = `
		color: rgb(113, 118, 123);
		text-decoration: none;
		&:hover {
			text-decoration: underline;
		}
	`;

	repoLink.appendChild(link);
	container.appendChild(repoLink);
	
  return container;
}


export function handleLsatButtonClick(tweet: Element, response: LsatResponse) {
  // Check if question container already exists
  const existingContainer = tweet.querySelector('.lsat-question-container');
  if (existingContainer) {
    existingContainer.remove();
    return;
  }

  // Find metrics section to insert before it
  const metricsSection = tweet.querySelector('[role="group"]');
  if (metricsSection) {
    // TODO: Get question data here
    const questionContainer = createQuestionContainer(response.question);
    metricsSection.parentElement?.insertBefore(questionContainer, metricsSection);
  }
}