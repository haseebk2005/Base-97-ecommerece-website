import { motion } from "framer-motion";
import { linkPoints } from "/src/assets/linkPoints.js";

const Map = () => {
  const center = linkPoints[0];
  const targets = linkPoints.slice(1);

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 9,
      opacity: 1,
      transition: { delay: i * 0.2, duration: 1.4, ease: [0.25, 0.1, 0.25, 1] },
    }),
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: i * 0.2 + 0.8, duration: 0.6, ease: "backOut" },
    }),
  };

  const getCurvedPath = (target) => {
    const midX = (center.x + target.x) / 2;
    const midY = (center.y + target.y) / 2;
    return `M ${center.x},${center.y} Q ${midX},${midY - 8} ${target.x},${target.y}`;
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Map Container (80% width) */}
      <div className="w-[80vw] max-w-[1800px] mx-auto relative h-[calc(80vw*0.6)]">
        {/* Map Background */}
        <img
          src="/src/assets/map.svg"
          alt="World Map"
          className="w-full h-full object-contain opacity-40"
        />

        {/* Animated Connections */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
        >
          <filter id="glow">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="1.5"
              floodColor="#ffffff"
            />
          </filter>

          {targets.map((target, i) => (
            <g key={`connection-${i}`}>
              <motion.path
                d={getCurvedPath(target)}
                initial="hidden"
                animate="visible"
                variants={lineVariants}
                custom={i}
                stroke="#ffffff"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="12.8 22.2"
                vectorEffect="non-scaling-stroke"
                filter="url(#glow)"
              />
              <motion.circle
                cx={target.x}
                cy={target.y}
                r="1.2"
                initial="hidden"
                animate="visible"
                variants={circleVariants}
                custom={i}
                fill="rgba(54,69,79,1)"
                stroke="#fff"
                strokeWidth="0.3"
              />
            </g>
          ))}
        </svg>

        {/* Center Hub */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${center.y}%`, left: `${center.x}%` }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2, opacity: 0.3 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
            className="absolute -inset-0"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(54,69,79,1)",
            }}
          />
          <img
            src="/src/assets/black_logo.png"
            alt="Connection Hub"
            className="relative z-10 w-10 h-10 rounded-full shadow-lg"
            style={{
              border: "2px solid rgba(250,250,250,1)",
              boxShadow: "0 0 12px rgba(54,69,79,1)",
            }}
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="absolute inset-0 pointer-events-none">
        

        <motion.div 
  className="
    absolute right-8 lg:right-12 bottom-8 lg:bottom-12
    bg-gray-300/60 backdrop-blur-sm rounded-lg shadow-xl
    flex flex-col lg:flex-row
    divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-gray-400
    w-fit 
    max-w-[min(600px,80vw)]    /* default */
    lg:max-w-[min(900px,60vw)] /* 1.5× wider on lg+ */
  "
  initial={{ opacity: 0, x: 20 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8, delay: 0.6 }}
  viewport={{ once: true, margin: "-100px" }}
>
  {/* Left section */}
  <motion.div 
  className="px-6 py-6 lg:pr-8 lg:py-8 flex-1"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ delay: 0.8 }}
>
  <p className="text-white font-medium text-lg lg:text-xl leading-snug">
    At <strong>Base 97</strong>, From moisture-wicking fabrics to 
    ergonomic seams, every piece is designed to keep you focused on the 
    finish line.
  </p>
</motion.div>

{/* Right section */}
<motion.div 
  className="px-6 py-6 lg:pl-8 lg:pr-20 lg:py-15 flex-2"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ delay: 1.0 }}
>
  <p className="text-gray-200 text-base lg:text-lg">
    Our commitment to sustainability means recycled yarns, low-impact dyes, 
    and end-of-life take-back programs. Join us in redefining what it means 
    to look good, feel unstoppable, and leave a lighter footprint on earth.
  </p>
</motion.div>

</motion.div>


      </div>
    </section>
  );
};

export default Map;