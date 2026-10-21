import { useState } from 'react';
import { PIECES, type Piece } from '../lib/pieces';

/** The Pieces tab: ready-made animated pieces, inserted at the playhead. */
export function PiecesLibrary(props: { onInsert: (piece: Piece) => void }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const list = PIECES.filter((p) => !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  return (
    <>
      <div className="lib-head">
        <input type="search" className="lib-search" placeholder="Search pieces" aria-label="Search pieces" value={query} onChange={(e) => setQuery(e.target.value)} />
        <p className="lib-help">Ready-made pieces from short-form video. Click one to add it at the playhead; it is an ordinary group you can change.</p>
      </div>
      <div className="lib-scroll">
      <ul className="piece-list">
        {list.map((p) => (
          <li key={p.id}>
            <button type="button" className="piece" onClick={() => props.onInsert(p)}>
              <strong>{p.name}</strong>
              <span>{p.description}</span>
            </button>
          </li>
        ))}
      </ul>
      </div>
    </>
  );
}
