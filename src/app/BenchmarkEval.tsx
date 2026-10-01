import AgentArchitecture from './components/AgentArchitecture';
import AgentDesignSteps from './components/AgentDesignSteps';
import '../styles/benchmark-eval.css';

export default function BenchmarkEval() {
  return <div className="benchmark-eval min-h-screen"><AgentArchitecture/><AgentDesignSteps/></div>;
}
