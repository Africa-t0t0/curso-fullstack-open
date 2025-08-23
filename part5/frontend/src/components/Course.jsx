export default function Course({ course }) {

    const totalOfExercises = course.parts.reduce((accumulator, currentValue) => accumulator + currentValue.exercises, 0);

    return (
        <>
            <h1>{course.name}</h1>
            {course.parts.map((part) => (
                <div key={part.id}>{part.name} {part.exercises}</div>
            ))}
            <div><strong>total of {totalOfExercises} exercises</strong></div>
        </>
    );

}