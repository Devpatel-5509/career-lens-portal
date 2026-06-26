import IntroPage from "./pages/IntroPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Explore from "./Explore";

import Analysis from "./pages/Analysis";
import Recommendations from "./pages/Recommendations";
import Jobs from "./pages/Jobs";
import Progress from "./pages/Progress";
import Assistant from "./pages/Assistant";
import Courses from './pages/Courses';
import JobFinder from './pages/JobFinder';

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />

        <Route path="/analysis" element={<Analysis />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/job-finder" element={<JobFinder />} />
      </Routes>
    </>
  );
}

export default App;
