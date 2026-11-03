import { useState, useEffect } from "react";
import "./App.css";

const EMOJIS = ["💻", "📡", "🔌", "🖥️", "⌨️", "🖱️", "📶", "🔒"];

const shuffle = () =>
  [...EMOJIS, ...EMOJIS]
    .map((emoji) => ({ emoji, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((c, i) => ({ id: i, emoji: c.emoji, matched: false }));

export default function App() {
  const [cards, setCards] = useState(shuffle);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);

  const won = cards.every((c) => c.matched);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    const t = setTimeout(() => {
      if (cards[a].emoji === cards[b].emoji) {
        setCards((prev) =>
          prev.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c))
        );
      }
      setFlipped([]);
    }, 700);
    return () => clearTimeout(t);
  }, [flipped, cards]);


  const handleFlip = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || cards[id].matched) return;
    setFlipped([...flipped, id]);
    if (flipped.length === 1) setMoves((m) => m + 1);
  };

  const restart = () => {
    setCards(shuffle());
    setFlipped([]);
    setMoves(0);
  };

  return (
    <div className="app">
      <h1>Memory Match</h1>
      <p className="moves">Moves: {moves}</p>

      <div className="grid">
        {cards.map((c) => {
          const show = flipped.includes(c.id) || c.matched;
          return (
            <button
              key={c.id}
              className={`card ${show ? "show" : ""} ${c.matched ? "matched" : ""}`}
              onClick={() => handleFlip(c.id)}
            >
              {show ? c.emoji : "?"}
            </button>
          );
        })}
      </div>


      {won && <h2 className="win">You won in {moves} moves!</h2>}
      <button className="restart" onClick={restart}>Restart</button>
    </div>
  );
}