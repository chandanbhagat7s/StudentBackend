const express = require('express');
const { createTeachersBatch, createTeacher, markTodayAsHoliday, todaysEvent, getAllEvent, uploadEventImages, resizeEventImage, createStudent, createStudentsBatch, createHomework, resizeHomeworkFiles, uploadHomeworkFiles, markStudentsPresenty, getAllTeachers, getAllBatches, getBatchById, getAllBatchesName, updateteacher, deleteTeacher, getPresentyDataOfTeacherbyMonth, createNotificationForTeacher, createNotificationForBatch, getTeacherById, getDashboardInfo, getPresentyStatusForToday, getAllStudentsBatchesName, getAllStudentListByBatchId, createCourse, getAllcourses, subscribeStudentToCourse, unsubscribeStudentToCourse, getAllStudentsOfCourse, actionOnLeave } = require('../Controllers/adminController');
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

adminRouter.get("/getDashboardInfo", getDashboardInfo)
adminRouter.get("/getTodaysPresentyData/:batchId", getPresentyStatusForToday)


adminRouter.post("/createNotification/teacher/:teacherId", createNotificationForTeacher) //done
adminRouter.post("/createNotification/batch/:batchId", createNotificationForBatch)  //done


adminRouter.post("/markDateAsHoliday", markTodayAsHoliday)




adminRouter.post("/todaysEvent", uploadEventImages, resizeEventImage, todaysEvent)



adminRouter.post("/createStudentbatch", createStudentsBatch) // done
adminRouter.get("/getAllStudentsBatchNames", getAllStudentsBatchesName) //done 
adminRouter.get("/getAllStudentsList/:batchId", getAllStudentListByBatchId) //done

adminRouter.post("/markTodaysStudentPresenty", markStudentsPresenty)  // done

adminRouter.post("/createStudent", createStudent)
adminRouter.post("/createHomework", uploadHomeworkFiles, resizeHomeworkFiles, createHomework)

// adminRouter.post("/createStudent",)


//leave 
adminRouter.post("/actionOnPendingLeaves", actionOnLeave)

// courses
adminRouter.post("/createCourses", createCourse)
adminRouter.get("/getAllcourses", getAllcourses)
adminRouter.get("/getAllCourseStudent/:courseId", getAllStudentsOfCourse)
adminRouter.post("/subscribeStudentToCourse", subscribeStudentToCourse)
adminRouter.post("/terminateSubscriptionForStudent", unsubscribeStudentToCourse)


module.exports = adminRouter;







