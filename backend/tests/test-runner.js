const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../server');

let mongoServer;

const runTests = async () => {
  console.log('🧪 Starting Automated Backend API Test Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Setup MongoMemoryServer
    process.env.NODE_ENV = 'test';
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('  📦 In-Memory MongoDB connected for isolated testing.\n');

    // Test 1: Health endpoint
    const healthRes = await request(app).get('/api/health');
    assert(healthRes.status === 200 && healthRes.body.status === 'ok' && healthRes.body.database.connected === true, 'GET /api/health reports OK and database connected');

    // Test 2: Create a task (POST /api/tasks)
    const newTask = {
      title: 'Complete Project Documentation',
      description: 'Write comprehensive README with API specifications',
      category: 'Documentation',
      priority: 'High',
      status: 'Pending',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
    };
    const createRes = await request(app).post('/api/tasks').send(newTask);
    assert(createRes.status === 201 && createRes.body.data.title === newTask.title, 'POST /api/tasks creates task successfully');
    const createdId = createRes.body.data._id;

    // Test 3: Validation failure on POST (empty title)
    const invalidRes = await request(app).post('/api/tasks').send({ title: '', priority: 'High' });
    assert(invalidRes.status === 400 && invalidRes.body.success === false, 'POST /api/tasks rejects empty title with 400 Bad Request');

    // Test 4: Validation failure on POST (invalid priority)
    const invalidPriorityRes = await request(app).post('/api/tasks').send({ title: 'Valid Title', priority: 'SuperHigh' });
    assert(invalidPriorityRes.status === 400 && invalidPriorityRes.body.success === false, 'POST /api/tasks rejects invalid priority');

    // Test 5: Create a second task
    await request(app).post('/api/tasks').send({
      title: 'Setup MongoDB Atlas Cluster',
      description: 'Configure network access and database user',
      category: 'DevOps',
      priority: 'Medium',
      status: 'In Progress',
    });

    // Test 6: Get all tasks (GET /api/tasks)
    const getRes = await request(app).get('/api/tasks');
    assert(getRes.status === 200 && Array.isArray(getRes.body.data) && getRes.body.count === 2, 'GET /api/tasks returns all tasks');

    // Test 7: Search filter (GET /api/tasks?search=Documentation)
    const searchRes = await request(app).get('/api/tasks?search=Documentation');
    assert(searchRes.status === 200 && searchRes.body.count === 1 && searchRes.body.data[0].title === newTask.title, 'GET /api/tasks?search matches task title');

    // Test 8: Status filter (GET /api/tasks?status=Pending)
    const statusRes = await request(app).get('/api/tasks?status=Pending');
    assert(statusRes.status === 200 && statusRes.body.count === 1 && statusRes.body.data[0].status === 'Pending', 'GET /api/tasks?status filters by status');

    // Test 9: Priority filter (GET /api/tasks?priority=High)
    const priorityRes = await request(app).get('/api/tasks?priority=High');
    assert(priorityRes.status === 200 && priorityRes.body.count === 1 && priorityRes.body.data[0].priority === 'High', 'GET /api/tasks?priority filters by priority');

    // Test 10: Stats Summary (GET /api/tasks/stats/summary)
    const statsRes = await request(app).get('/api/tasks/stats/summary');
    assert(
      statsRes.status === 200 &&
      statsRes.body.data.total === 2 &&
      statsRes.body.data.pending === 1 &&
      statsRes.body.data.inProgress === 1 &&
      statsRes.body.data.highPriority === 1,
      'GET /api/tasks/stats/summary returns correct dashboard counters'
    );

    // Test 11: Get single task by ID (GET /api/tasks/:id)
    const getOneRes = await request(app).get(`/api/tasks/${createdId}`);
    assert(getOneRes.status === 200 && getOneRes.body.data._id === createdId, 'GET /api/tasks/:id returns single task');

    // Test 12: Invalid ObjectId format (GET /api/tasks/invalid-id-123)
    const badIdRes = await request(app).get('/api/tasks/invalid-id-123');
    assert(badIdRes.status === 400 && badIdRes.body.success === false, 'GET /api/tasks/invalid-id handles bad ObjectId format with 400');

    // Test 13: Non-existent valid ObjectId (GET /api/tasks/507f1f77bcf86cd799439011)
    const nonExistentRes = await request(app).get('/api/tasks/507f1f77bcf86cd799439011');
    assert(nonExistentRes.status === 404 && nonExistentRes.body.success === false, 'GET /api/tasks/:id returns 404 for non-existent ID');

    // Test 14: Update task (PUT /api/tasks/:id)
    const updateRes = await request(app).put(`/api/tasks/${createdId}`).send({
      title: 'Updated Documentation Title',
      priority: 'Low',
    });
    assert(updateRes.status === 200 && updateRes.body.data.title === 'Updated Documentation Title' && updateRes.body.data.priority === 'Low', 'PUT /api/tasks/:id updates task details');

    // Test 15: Patch status (PATCH /api/tasks/:id/status)
    const patchRes = await request(app).patch(`/api/tasks/${createdId}/status`).send({
      status: 'Completed',
    });
    assert(patchRes.status === 200 && patchRes.body.data.status === 'Completed', 'PATCH /api/tasks/:id/status updates status to Completed');

    // Test 16: Delete task (DELETE /api/tasks/:id)
    const deleteRes = await request(app).delete(`/api/tasks/${createdId}`);
    assert(deleteRes.status === 200 && deleteRes.body.success === true, 'DELETE /api/tasks/:id deletes task');

    // Test 17: Verify deleted task is gone
    const verifyDeleteRes = await request(app).get(`/api/tasks/${createdId}`);
    assert(verifyDeleteRes.status === 404, 'Deleted task is no longer found (404)');

    console.log(`\n========================================`);
    console.log(`🎯 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    await mongoose.disconnect();
    await mongoServer.stop();

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal Test Error:', error);
    if (mongoServer) await mongoServer.stop();
    process.exit(1);
  }
};

runTests();

