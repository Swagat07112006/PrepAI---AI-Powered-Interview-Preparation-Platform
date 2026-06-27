import { Router } from 'express';
const router = Router();

router.route('/due').get((req, res) => {
    res.send(
        {
            msg: "Not Implemented",
        }
    )
})
router.route('/upcoming').get((req, res) => {
    res.send(
        {
            msg: "Not Implemented",
        }
    )
})
router.route('/completed').get((req, res) => {
    res.send(
        {
            msg: "Not Implemented",
        }
    )
})

export default router