const express = require('express');
const { createTeachersBatch, createTeacher, markTodayAsHoliday, todaysEvent, getAllEvent, uploadEventImages, resizeEventImage, createStudent, createStudentsBatch, createHomework, resizeHomeworkFiles, uploadHomeworkFiles, markStudentsPresenty, getAllTeachers, getAllBatches, getBatchById, getAllBatchesName, updateteacher, deleteTeacher, getPresentyDataOfTeacherbyMonth, createNotificationForTeacher, createNotificationForBatch, getTeacherById } = require('../Controllers/adminController');
const { isLoggedIn } = require('../Middleware/isLoggedIn');
const { giveAccessTo } = require('../Middleware/giveAccessTo');

const adminRouter = express.Router()


adminRouter.get("/getAllEvents", getAllEvent)
adminRouter.use(isLoggedIn, giveAccessTo("ADMIN"))


adminRouter.post("/createTeachersbatch", createTeachersBatch) //done
adminRouter.get("/getAllBatches", getAllBatches)  //done
adminRouter.get("/getAllBatchNames", getAllBatchesName) //done
adminRouter.get("/getBatch/:batchId", getBatchById) //done

adminRouter.get("/getPresentyData/:teacherId/:month", getPresentyDataOfTeacherbyMonth) //done
adminRouter.get("/getDataOfTeacher/:teacherId", getTeacherById) //done

adminRouter.post("/createTeachers", createTeacher) // done
adminRouter.patch("/updateTeacher", updateteacher) // done
adminRouter.delete("/deleteTeacher", deleteTeacher) // done
adminRouter.get("/getAllTeachers/:branchId", getAllTeachers) //done


adminRouter.post("/createNotification/teacher/:teacherId", createNotificationForTeacher) //done
adminRouter.post("/createNotification/batch/:batchId", createNotificationForBatch)  //done


adminRouter.post("/markDateAsHoliday", markTodayAsHoliday)





adminRouter.post("/createStudentbatch", createStudentsBatch)



adminRouter.post("/markTodaysStudentPresenty", markStudentsPresenty)
adminRouter.post("/todaysEvent", uploadEventImages, resizeEventImage, todaysEvent)




adminRouter.post("/createStudent", createStudent)
adminRouter.post("/createHomework", uploadHomeworkFiles, resizeHomeworkFiles, createHomework)

// adminRouter.post("/createStudent",)

module.exports = adminRouter;







