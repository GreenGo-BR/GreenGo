interface CanBackgroundProps {
  density?: "light" | "medium" | "dense";
  className?: string;
}

export function CanBackground({
  density = "medium",
  className = "",
}: CanBackgroundProps) {
  const canCount = density === "light" ? 3 : density === "medium" ? 5 : 7;

  const generateCanPositions = () => {
    const positions = [];

    for (let i = 0; i < canCount; i++) {
      const size = Math.random() * 40 + 30; // 30-70px
      const rotation = Math.random() * 60 - 30; // -30 to 30 degrees
      const animationDelay = Math.random() * 3; // 0-3s delay

      // Posições distribuídas
      const top = Math.random() * 80 + 10; // 10-90%
      const left = Math.random() * 80 + 10; // 10-90%

      positions.push({
        id: i,
        size,
        rotation,
        animationDelay,
        top,
        left,
      });
    }

    return positions;
  };

  const cans = generateCanPositions();

  return (
    <div className={`can-background ${className}`}>
      {cans.map((can) => (
        <img
          key={can.id}
          src="/images/latinha.png"
          alt=""
          className="float"
          style={{
            width: `${can.size}px`,
            height: `${can.size}px`,
            top: `${can.top}%`,
            left: `${can.left}%`,
            transform: `rotate(${can.rotation}deg)`,
            animationDelay: `${can.animationDelay}s`,
          }}
        />
      ))}
    </div>
  );
}
