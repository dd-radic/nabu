import React from 'react';
import { Link } from 'react-router-dom';
import ResourceCard from './ResourceCard';

const QuizCard = (resource) => {
     return (
                <Link 
                    to={`/quiz/${resource.id}`} 
                    key={resource.id} 
                    className="classroom-card-link"
                >
                    <ResourceCard resource={resource}>

                    </ResourceCard>
                </Link>
            );
};

export default QuizCard;