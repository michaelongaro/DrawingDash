// formatting function to display HH:MM:SS for countdown
const formatTime = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a complete state
    return <div>New prompts are arriving soon!</div>;
  } else {
    // Render a countdown
    let formattedHours = hours < 10 ? `0${hours}` : hours;
    let formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    let formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return (
      <span>
        {formattedHours}:{formattedMinutes}:{formattedSeconds}
      </span>
    );
  }
};

export default formatTime;
