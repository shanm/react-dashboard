import "./Card.css";

interface CardProps {
    title: string;
    value: string;
}

function Card({ title, value }: CardProps) {
    return (
        <div className="card">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    )
}

export default Card;
