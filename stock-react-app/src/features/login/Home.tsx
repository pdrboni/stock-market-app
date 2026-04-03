import { useAppDispatch, useAppSelector } from '../../hooks';
import { increment, decrement } from '../counter/counterSlice';

function Home() {
  const counter = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <>
      <div>
        <span>Hello world</span>
        <button onClick={() => dispatch(increment())}>+ counter</button>
        <button onClick={() => dispatch(decrement())}>- counter</button>
        <span>{counter}</span>
      </div>
    </>
  );
}

export default Home;
