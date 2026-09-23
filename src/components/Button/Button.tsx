import "./Button.css";

interface ButtonProps {
    label: string;
    onClick?: () => void;
}

function Button({ label, onClick }: ButtonProps) {
    return (
        <button className="custom-button" onClick={onClick}>
            {label}
        </button>
    )
}

export default Button;
