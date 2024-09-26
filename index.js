const express = require('express');
const app = express();
const port = 3000;
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({ 
    dialect: 'sqlite',  
    storage: 'database.sqlite' 
});

const Comments = sequelize.define('Comments', {
    content: {                         
        type: DataTypes.STRING,   
        allowNull: false  
    }
});

(async () => {  
    await Comments.sync({ force: true });
    console.log("The table for the User model was just (re)created!");
})();


let comments = []; //댓글 데이터가 담기는 배열을 comments 변수에 할당

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
    const comments = await Comments.findAll();
    res.render('index', {comments:comments});
});

app.post('/create', async (req, res) => {
    console.log(req.body);
    const {content} = req.body; //content를 name으로 갖느 데이터 가져오기
    const comment = await Comments.create({ content: content});
    console.log(comment.id);
    res.redirect('/'); //post 요청이 정상처리되면 '/'경로로 페이지 이동
});

app.post('/update/:id', async (req, res) => {
    console.log(req.params);
    console.log(req.body);
    const { id } = req.params;
    const { content } = req.body;
    await Comments.update({ content: content }, {
        where: {
            id: id
        }
    });
    res.redirect('/');
});

    app.post('/delete/:id', async(req, res) => {
        console.log(req.params);
        const {id} = req.params;
        await Comments.destroy({
            where: {
                id: id
            }
        });     
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});