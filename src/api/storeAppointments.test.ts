import { describe, expect, it, vi } from 'vitest';
import { getStoreAppointmentDetail, pageStoreAppointments, updateStoreAppointmentStatus } from './storeAppointments';

describe('store appointments api', () => {
  it('posts page query to backend store appointments endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(successResponse({
      dataList: [
        {
          appointmentId: 101,
          storeCode: 'luyu-nail',
          storeName: '鹿屿美甲工作室',
          projectCode: 'basic-nail',
          projectName: '基础美甲',
          staffCode: 'staff-amy',
          staffName: 'Amy',
          customerDisplayName: '王女士',
          customerContact: '13800001111',
          appointmentDate: '2026-06-20',
          timeSlot: '10:00',
          status: 'pending',
          remark: '想做玫瑰色',
          createdAt: '2026-06-19T09:00:00',
          updatedAt: '2026-06-19T09:00:00'
        }
      ],
      totalCount: 1
    }));

    const result = await pageStoreAppointments({
      pageNo: 1,
      pageSize: 20,
      storeCode: 'luyu-nail',
      projectCode: 'basic-nail',
      staffCode: 'staff-amy',
      status: 'pending',
      appointmentDate: '2026-06-20'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/store-appointments/page', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 20,
        storeCode: 'luyu-nail',
        projectCode: 'basic-nail',
        staffCode: 'staff-amy',
        status: 'pending',
        appointmentDate: '2026-06-20'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].appointmentId).toBe(101);
    expect(result.dataList[0].customerContact).toBe('13800001111');
  });

  it('gets appointment detail with status logs by appointment id', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(successResponse({
      appointment: {
        appointmentId: 101,
        storeCode: 'luyu-nail',
        storeName: '鹿屿美甲工作室',
        projectCode: 'basic-nail',
        projectName: '基础美甲',
        staffCode: 'staff-amy',
        staffName: 'Amy',
        customerDisplayName: '王女士',
        customerContact: '13800001111',
        appointmentDate: '2026-06-20',
        timeSlot: '10:00',
        status: 'confirmed',
        remark: '想做玫瑰色',
        createdAt: '2026-06-19T09:00:00',
        updatedAt: '2026-06-19T09:30:00'
      },
      statusLogs: [
        {
          fromStatus: 'pending',
          toStatus: 'confirmed',
          operatorType: 'admin',
          operatorId: 'admin-1',
          createdAt: '2026-06-19T09:30:00'
        }
      ]
    }));

    const result = await getStoreAppointmentDetail(101);

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/store-appointments/101', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.appointment.status).toBe('confirmed');
    expect(result.statusLogs[0].toStatus).toBe('confirmed');
  });

  it('posts status update to backend store appointments status endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(successResponse({
      appointmentId: 101,
      storeCode: 'luyu-nail',
      storeName: '鹿屿美甲工作室',
      projectCode: 'basic-nail',
      projectName: '基础美甲',
      staffCode: 'staff-amy',
      staffName: 'Amy',
      customerDisplayName: '王女士',
      customerContact: '13800001111',
      appointmentDate: '2026-06-20',
      timeSlot: '10:00',
      status: 'confirmed',
      remark: '想做玫瑰色',
      createdAt: '2026-06-19T09:00:00',
      updatedAt: '2026-06-19T09:30:00'
    }));

    const result = await updateStoreAppointmentStatus(101, { status: 'confirmed' });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/store-appointments/101/status', {
      method: 'POST',
      body: JSON.stringify({ status: 'confirmed' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.status).toBe('confirmed');
  });
});

function successResponse(data: unknown) {
  return {
    ok: true,
    json: async () => ({
      success: true,
      code: '0',
      msg: '',
      data
    })
  } as Response;
}
