const { sequelize } = require('./config/database');
const { User, Course, Lesson, Quiz, Question, Answer, QuizResult, ChatMessage } = require('./models');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const seedData = async () => {
    try {
        console.log('🚀 Bắt đầu quá trình Seeder chuyên nghiệp từ file JSON...');

        // Đọc dữ liệu từ JSON
        const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/seed/users.json'), 'utf8'));
        const coursesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/seed/courses.json'), 'utf8'));
        const lessonsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/seed/lessons.json'), 'utf8'));
        const questionsPool = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/seed/questions.json'), 'utf8'));
        const chatMessagesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/seed/chat.json'), 'utf8'));

        await sequelize.sync({ force: true });

        const rawPassword = '123456789';

        // 1. Tạo Admin
        const admin = await User.create({
            username: 'Quản trị viên',
            email: 'admin@gmail.com',
            password: rawPassword,
            role: 'admin'
        });

        const teachers = await User.bulkCreate([
            {
                username: 'Nguyễn Văn An',
                email: 'teacheran@gmail.com',
                password: rawPassword,
                role: 'teacher'
            },
            {
                username: 'Trần Thị Bình',
                email: 'teacherbinh@gmail.com',
                password: rawPassword,
                role: 'teacher'
            },
            {
                username: 'Lê Văn Cường',
                email: 'teachercuong@gmail.com',
                password: rawPassword,
                role: 'teacher'
            }
        ], {
            individualHooks: true
        });


        // 2. Users
        const studentUsers = await User.bulkCreate(usersData.map(u => ({
            ...u,
            password: rawPassword
        })), { individualHooks: true });

        console.log(`👤 Đã tạo ${studentUsers.length} học viên thật.`);

        // 3. Courses
        const createdCourses = await Course.bulkCreate(
            coursesData.map(c => ({
                ...c,
                teacher_id: teachers[0].id
            }))
        );

        console.log(`📚 Đã tạo ${createdCourses.length} khóa học.`);

        // 4. Lessons + Quiz + Questions
        let questionIndex = 0;
        let lessonCount = 0;
        let questionCount = 0;

        for (const course of createdCourses) {
            const courseLessons = lessonsData.filter(l => l.course_title === course.title);

            for (const lData of courseLessons) {

                const lesson = await Lesson.create({
                    course_id: course.id,
                    title: lData.title,
                    content: lData.content,
                    video_url: lData.video_url || 'https://www.youtube.com/embed/1rruf4Ub9Zk?si=ROeDqQG9v6dAyoe8',
                    order_index: lData.order_index
                });

                lessonCount++;

                const quiz = await Quiz.create({
                    lesson_id: lesson.id,
                    course_id: course.id,
                    title: `Kiểm tra: ${lesson.title}`,
                    description: `Bài kiểm tra đánh giá năng lực cho phần ${lesson.title}`,
                    time_limit: 20
                });

                for (let k = 0; k < 10; k++) {
                    const qData = questionsPool[questionIndex % questionsPool.length];
                    questionIndex++;

                    const question = await Question.create({
                        quiz_id: quiz.id,
                        question_text: qData.question,
                        explanation: qData.explanation
                    });

                    questionCount++;

                    const answers = [
                        { text: qData.a, isCorrect: qData.correct.includes('a') },
                        { text: qData.b, isCorrect: qData.correct.includes('b') },
                        { text: qData.c, isCorrect: qData.correct.includes('c') },
                        { text: qData.d, isCorrect: qData.correct.includes('d') }
                    ];

                    await Answer.bulkCreate(answers.map(a => ({
                        question_id: question.id,
                        answer_text: a.text,
                        is_correct: a.isCorrect
                    })));
                }
            }
        }

        console.log(`📖 Đã tạo ${lessonCount} bài học.`);
        console.log(`❓ Đã tạo ${questionCount} câu hỏi.`);

        // 5. Quiz Results
        const allQuizzes = await Quiz.findAll();
        const results = [];

        for (let i = 0; i < 350; i++) {
            const s = studentUsers[Math.floor(Math.random() * studentUsers.length)];
            const q = allQuizzes[Math.floor(Math.random() * allQuizzes.length)];
            const score = Math.floor(Math.random() * 11) + 10;

            results.push({
                user_id: s.id,
                quiz_id: q.id,
                score: Math.floor((score / 20) * 10),
                total_questions: 20,
                correct_answers: score,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
            });
        }

        const chunkSize = 50;

        for (let i = 0; i < results.length; i += chunkSize) {
            await QuizResult.bulkCreate(results.slice(i, i + chunkSize));
        }

        console.log(`🏆 Đã tạo ${results.length} kết quả thi thực tế.`);

        // 6. Chat Messages (FIX Sequelize chuẩn)
        const chatMessages = chatMessagesData.map(msg => ({
            id: msg.id,
            user_id: msg.user_id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.created_at,
            updatedAt: msg.updated_at
        }));

        await ChatMessage.bulkCreate(chatMessages);

        console.log(`💬 Đã tạo ${chatMessages.length} tin nhắn chat.`);

        console.log('✅ HOÀN TẤT SEEDER DỮ LIỆU!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi Seeding:', error);
        process.exit(1);
    }
};

seedData();