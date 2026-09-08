import { useState } from 'react';
import NewspaperIntro from './components/NewspaperIntro.jsx';
import Newspaper from './components/Newspaper.jsx';
import ThingCursor from './components/ThingCursor.jsx';

export default function App() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="min-h-screen w-full">
      {!opened && <NewspaperIntro onOpened={() => setOpened(true)} />}
      <Newspaper visible={opened} />
      {opened && <ThingCursor />}
    </div>
  );
}
