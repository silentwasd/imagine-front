export default function () {
    const state = useState('token', () => '');

    return {state};
}