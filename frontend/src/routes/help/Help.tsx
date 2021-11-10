import { FC } from 'react';

import Container from 'components/container';
import Typography from 'components/typography';

import './Help.scss';

const Help: FC = () => {
  return (
    <Container isNarrow={true}>
      <Typography className="is-bold" size="medium">
        <p>Welcome to Code2Gather!</p>
      </Typography>
      <Typography size="regular">
        <p>
          Code2Gather is designed to help programmers to secure internships and
          jobs. At many tech companies today, algorithm and coding problems form
          the largest component of the interview process. These problem-solving
          sessions allow for interviewers to evaluate candidates&apos; abilities
          to solve algorithmic challenges.
        </p>
        <p>
          However, unlike solving problems on your own, these technical
          interviews expect candidates to be able to not just come up with
          solutions, but also clearly articulate their thought process and
          engage the interviewer. This makes technical interviews very difficult
          to prepare for alone, and finding peers to practice with, as well as
          coordinating mock interviews, can be an arduous process.
        </p>
        <p>
          Code2Gather is thus here to help. Code2Gather allows you to focus on
          the practicing, instead of finding people to practice with. On our
          platform, you can simply select a question difficulty that you wish to
          attempt, and we will match you with a suitable mock interview partner!
          No need to worry about the questions or channels for feedback -
          Code2Gather will settle everything for you.
        </p>
      </Typography>
      <Typography className="is-bold" size="medium">
        <p>If you&apos;re familiar with technical interviews...</p>
      </Typography>
      <Typography size="regular">
        <p>
          Simply watch this video below, and you will get a good understanding
          of how to use our platform!
        </p>
        <div className="video-container">
          <iframe
            allowFullScreen={true}
            frameBorder="0"
            src="https://www.youtube.com/embed/5cVotr76mx4"
            title="Demo Video"
          />
        </div>
      </Typography>
      <br />
      <Typography className="is-bold" size="medium">
        <p>If you&apos;re new to technical interviews...</p>
      </Typography>
      <Typography className="bottom-section" size="regular">
        <p>
          There are a lot of excellent resources out there to get you started
          with technical interviews. Here are some of our favourites:
        </p>
        <ul>
          <li>
            <a
              className="is-success"
              href="https://www.crackingthecodinginterview.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Cracking the Coding Interview
            </a>
          </li>
          <li>
            <a
              className="is-success"
              href="https://techinterviewhandbook.org/coding-round-overview/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Yangshun&apos;s Tech Interview Handbook
            </a>
          </li>
          <li>
            <a
              className="is-success"
              href="https://www.educative.io/courses/grokking-the-coding-interview"
              rel="noopener noreferrer"
              target="_blank"
            >
              Grokking the Coding Interview: Patterns for Coding Questions
            </a>
          </li>
        </ul>
      </Typography>
    </Container>
  );
};

export default Help;
