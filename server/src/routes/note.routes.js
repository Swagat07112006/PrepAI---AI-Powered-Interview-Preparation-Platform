import {Router} from 'express'
import { createNote } from '../controllers/note.controller';
const router = Router();

router.route('/').post(createNote)
router.route('/').get((req, res) => {
    res.status(501).json({
        msg: "Not Implemented"
    })
})
router.route('/:id').get((req, res) => {
    res.status(501).json({
        msg: "Not Implemented"
    })
})
router.route('/:id').put((req, res) => {
    res.status(501).json({
        msg: "Not Implemented"
    })
})
router.route('/:id').delete((req, res) => {
    res.status(501).json({
        msg: "Not Implemented"
    })
})

export default router