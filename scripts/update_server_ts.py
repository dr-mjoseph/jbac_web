with open('backend/server.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Promise.all in admin-dashboard-stats in server.ts
old_promise = """        const [believers, believers_today, pastors, pastors_today, churches, churches_today, students, students_today, ministries, ministries_today, organisations, organisations_today, events_active, events_today, events_total, users, users_today] = await Promise.all([
            getCount('signup_form'), getTodayCount('signup_form'),
            getCount('pastor_reg'), getTodayCount('pastor_reg'),
            getCount('church_reg'), getTodayCount('church_reg'),
            getCount('student_reg'), getTodayCount('student_reg'),
            getCount('ministry_signup'), getTodayCount('ministry_signup'),
            getCount('independentorganisation_reg'), getTodayCount('independentorganisation_reg'),
            getCount('events', "WHERE d_in = 0 OR d_in IS NULL"), getTodayCount('events'),
            getCount('events'),
            getCount('users'), getTodayCount('users')
        ]);

        res.json({
            status: 200,
            success: true,
            state_id: stateId || 'all',
            today_date: todayDate,
            stats: {
                believers,
                believers_today,
                pastors,
                pastors_today,
                churches,
                churches_today,
                students,
                students_today,
                ministries,
                ministries_today,
                organisations,
                organisations_today,
                events_active,
                events_today,
                events_total,
                users,
                users_today
            }
        });"""

new_promise = """        const [believers, believers_today, pastors, pastors_today, churches, churches_today, students, students_today, ministries, ministries_today, organisations, organisations_today, pastor_associations, pastor_associations_today, events_active, events_today, events_total, users, users_today] = await Promise.all([
            getCount('signup_form'), getTodayCount('signup_form'),
            getCount('pastor_reg'), getTodayCount('pastor_reg'),
            getCount('church_reg'), getTodayCount('church_reg'),
            getCount('student_reg'), getTodayCount('student_reg'),
            getCount('ministry_signup'), getTodayCount('ministry_signup'),
            getCount('independentorganisation_reg'), getTodayCount('independentorganisation_reg'),
            getCount('pastors_associations'), getTodayCount('pastors_associations'),
            getCount('events', "WHERE d_in = 0 OR d_in IS NULL"), getTodayCount('events'),
            getCount('events'),
            getCount('users'), getTodayCount('users')
        ]);

        res.json({
            status: 200,
            success: true,
            state_id: stateId || 'all',
            today_date: todayDate,
            stats: {
                believers,
                believers_today,
                pastors,
                pastors_today,
                churches,
                churches_today,
                students,
                students_today,
                ministries,
                ministries_today,
                organisations,
                organisations_today,
                pastor_associations,
                pastor_associations_today,
                events_active,
                events_today,
                events_total,
                users,
                users_today
            }
        });"""

if old_promise in content:
    content = content.replace(old_promise, new_promise)
    print("Updated Promise.all in backend/server.ts")

# 2. Update getCount / getTodayCount in server.ts
old_counts = """        async function getCount(tbl: string, baseWhere = ''): Promise<number> {
            try {
                let where = baseWhere ? baseWhere.trim() : '';
                if (stateId) {
                    if (where) {
                        where += ` AND (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                    } else {
                        where = `WHERE (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                    }
                }
                const [r]: any = await db.query(`SELECT COUNT(*) as cnt FROM \`${tbl}\` ${where}`);
                return r && r[0] ? Number(r[0].cnt) : 0;
            } catch (_) {
                return 0;
            }
        }

        async function getTodayCount(tbl: string, baseWhere = ''): Promise<number> {
            try {
                let where = baseWhere ? baseWhere.trim() : '';
                let dateCondition = `(cts LIKE '${todayDate}%' OR (cts IS NULL AND i_ts LIKE '${todayDate}%'))`;
                if (tbl === 'events') {
                    dateCondition = `(cts LIKE '${todayDate}%' OR startdate = '${todayDate}')`;
                }
                if (where) {
                    where += ` AND ${dateCondition}`;
                } else {
                    where = `WHERE ${dateCondition}`;
                }
                if (stateId) {
                    where += ` AND (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                }
                const [r]: any = await db.query(`SELECT COUNT(*) as cnt FROM \`${tbl}\` ${where}`);
                return r && r[0] ? Number(r[0].cnt) : 0;
            } catch (_) {
                return 0;
            }
        }"""

new_counts = """        async function getCount(tbl: string, baseWhere = ''): Promise<number> {
            try {
                let where = baseWhere ? baseWhere.trim() : '';
                if (stateId) {
                    if (where) {
                        where += ` AND (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                    } else {
                        where = `WHERE (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                    }
                }
                const [r]: any = await db.query(`SELECT COUNT(*) as cnt FROM \`${tbl}\` ${where}`);
                return r && r[0] ? Number(r[0].cnt) : 0;
            } catch (_) {
                try {
                    const [r2]: any = await db.query(`SELECT COUNT(*) as cnt FROM \`${tbl}\` ${baseWhere ? baseWhere.trim() : ''}`);
                    return r2 && r2[0] ? Number(r2[0].cnt) : 0;
                } catch (e2) {
                    return 0;
                }
            }
        }

        async function getTodayCount(tbl: string, baseWhere = ''): Promise<number> {
            try {
                let where = baseWhere ? baseWhere.trim() : '';
                let dateCondition = `(cts LIKE '${todayDate}%' OR (cts IS NULL AND i_ts LIKE '${todayDate}%'))`;
                if (tbl === 'events') {
                    dateCondition = `(cts LIKE '${todayDate}%' OR startdate = '${todayDate}')`;
                }
                if (where) {
                    where += ` AND ${dateCondition}`;
                } else {
                    where = `WHERE ${dateCondition}`;
                }
                if (stateId) {
                    where += ` AND (state_id = ${stateId} OR (state_id IS NULL AND ${stateId} = 1))`;
                }
                const [r]: any = await db.query(`SELECT COUNT(*) as cnt FROM \`${tbl}\` ${where}`);
                return r && r[0] ? Number(r[0].cnt) : 0;
            } catch (_) {
                try {
                    let dateCondition = `(cts LIKE '${todayDate}%' OR (cts IS NULL AND i_ts LIKE '${todayDate}%'))`;
                    if (tbl === 'events') {
                        dateCondition = `(cts LIKE '${todayDate}%' OR startdate = '${todayDate}')`;
                    }
                    let fallbackWhere = baseWhere ? `${baseWhere.trim()} AND ${dateCondition}` : `WHERE ${dateCondition}`;
                    const [r2]: any = await db.query(`SELECT COUNT(*) as cnt FROM \`${tbl}\` ${fallbackWhere}`);
                    return r2 && r2[0] ? Number(r2[0].cnt) : 0;
                } catch (e2) {
                    return 0;
                }
            }
        }"""

if old_counts in content:
    content = content.replace(old_counts, new_counts)
    print("Updated getCount and getTodayCount in backend/server.ts")

with open('backend/server.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated server.ts successfully")

