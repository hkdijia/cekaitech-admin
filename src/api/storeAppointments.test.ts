import { describe, expect, it, vi } from 'vitest';
import {
  getStoreAppointmentRules,
  getStoreAppointmentServiceCatalog,
  getStoreAppointmentStaffRoster,
  getStoreAppointmentStoreProfile,
  getStoreAppointmentBookingConfig,
  getStoreAppointmentDetail,
  pageStoreAppointments,
  updateStoreAppointmentRules,
  updateStoreAppointmentServiceCatalog,
  updateStoreAppointmentStaffRoster,
  updateStoreAppointmentStoreProfile,
  updateStoreAppointmentStatus
} from './storeAppointments';

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

  it('gets booking config snapshot from miniapp public config endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(successResponse({
      store: {
        storeCode: 'store-config-001',
        name: '中性预约门店',
        industry: 'beauty',
        phone: '0571-00000000',
        address: '杭州市示例路 1 号',
        businessHours: '10:00-20:00',
        staffLabel: '员工',
        projectLabel: '项目',
        showPrice: true
      },
      serviceProjects: [
        {
          projectCode: 'basic-service',
          categoryId: 'general',
          name: '基础服务',
          summary: '适合首次体验',
          durationMinutes: 60,
          priceText: '到店咨询',
          showPrice: true
        }
      ],
      staffMembers: [
        {
          staffCode: 'staff-001',
          name: '员工 A',
          role: '服务顾问',
          bio: '擅长基础服务',
          avatarUrl: '',
          trustHighlights: '3 年经验'
        }
      ],
      staffProjects: [
        {
          staffCode: 'staff-001',
          projectCode: 'basic-service'
        }
      ],
      appointmentRule: {
        bookingWindowDays: 14,
        defaultDurationMinutes: 60,
        defaultSlots: ['10:00', '14:00'],
        confirmationHint: '到店前确认',
        cancelHint: '如需取消请提前联系'
      }
    }));

    const result = await getStoreAppointmentBookingConfig('store-appointment-template', 'store-config-001');

    expect(fetchMock).toHaveBeenCalledWith('/api/miniapps/store-appointment-template/stores/store-config-001/booking-config', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.store.storeCode).toBe('store-config-001');
    expect(result.serviceProjects[0].priceText).toBe('到店咨询');
    expect(result.staffProjects[0].staffCode).toBe('staff-001');
    expect(result.appointmentRule.defaultSlots).toEqual(['10:00', '14:00']);
  });

  it('gets store appointment admin config blocks from controlled backend endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(successResponse({
        storeCode: 'store-config-001',
        name: '中性预约门店',
        industry: 'beauty',
        phone: '0571-00000000',
        address: '杭州市示例路 1 号',
        businessHours: '10:00-20:00',
        staffLabel: '员工',
        projectLabel: '项目',
        showPrice: true,
        enabled: true,
        updatedAt: '2026-06-26T08:00:00'
      }))
      .mockResolvedValueOnce(successResponse([
        {
          storeCode: 'store-config-001',
          projectCode: 'basic-service',
          categoryId: 'general',
          name: '基础服务',
          summary: '适合首次体验',
          durationMinutes: 60,
          priceText: '到店咨询',
          showPrice: true,
          enabled: true,
          updatedAt: '2026-06-26T08:00:00'
        }
      ]))
      .mockResolvedValueOnce(successResponse([
        {
          storeCode: 'store-config-001',
          staffCode: 'staff-001',
          name: '员工 A',
          role: '服务顾问',
          bio: '擅长基础服务',
          avatarUrl: '',
          trustHighlights: ['3 年经验'],
          enabled: true,
          projectCodes: ['basic-service'],
          updatedAt: '2026-06-26T08:00:00'
        }
      ]))
      .mockResolvedValueOnce(successResponse({
        storeCode: 'store-config-001',
        bookingWindowDays: 14,
        defaultDurationMinutes: 60,
        defaultSlots: ['10:00', '14:00'],
        confirmationHint: '到店前确认',
        cancelHint: '如需取消请提前联系',
        updatedAt: '2026-06-26T08:00:00'
      }));

    const storeProfile = await getStoreAppointmentStoreProfile('store-config-001');
    const serviceCatalog = await getStoreAppointmentServiceCatalog('store-config-001');
    const staffRoster = await getStoreAppointmentStaffRoster('store-config-001');
    const rules = await getStoreAppointmentRules('store-config-001');

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/store-appointment-config/stores/store-config-001', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/store-appointment-config/stores/store-config-001/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/store-appointment-config/stores/store-config-001/staff', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(4, '/api/admin/store-appointment-config/rules/store-config-001', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(storeProfile.storeCode).toBe('store-config-001');
    expect(serviceCatalog[0].projectCode).toBe('basic-service');
    expect(staffRoster[0].projectCodes).toEqual(['basic-service']);
    expect(rules.defaultSlots).toEqual(['10:00', '14:00']);
  });

  it('puts store appointment admin config blocks with request id headers', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(successResponse({
        storeCode: 'store-config-001',
        name: '新门店名',
        industry: 'beauty',
        phone: '0571-00000001',
        address: '杭州市示例路 2 号',
        businessHours: '09:00-21:00',
        staffLabel: '老师',
        projectLabel: '护理',
        showPrice: false,
        enabled: true,
        updatedAt: '2026-06-26T08:10:00'
      }))
      .mockResolvedValueOnce(successResponse({
        storeCode: 'store-config-001',
        projectCode: 'basic-service',
        categoryId: 'general',
        name: '基础护理',
        summary: '适合首次体验',
        durationMinutes: 75,
        priceText: '到店咨询',
        showPrice: false,
        enabled: true,
        updatedAt: '2026-06-26T08:11:00'
      }))
      .mockResolvedValueOnce(successResponse({
        storeCode: 'store-config-001',
        staffCode: 'staff-001',
        name: '员工 A',
        role: '主理人',
        bio: '擅长基础服务',
        avatarUrl: '',
        trustHighlights: ['3 年经验'],
        enabled: true,
        projectCodes: ['basic-service'],
        updatedAt: '2026-06-26T08:12:00'
      }))
      .mockResolvedValueOnce(successResponse({
        storeCode: 'store-config-001',
        bookingWindowDays: 21,
        defaultDurationMinutes: 75,
        defaultSlots: ['09:30', '15:00'],
        confirmationHint: '到店前确认',
        cancelHint: '如需取消请提前联系',
        updatedAt: '2026-06-26T08:13:00'
      }));

    const storeProfile = await updateStoreAppointmentStoreProfile('store-config-001', {
      name: '新门店名',
      industry: 'beauty',
      phone: '0571-00000001',
      address: '杭州市示例路 2 号',
      businessHours: '09:00-21:00',
      staffLabel: '老师',
      projectLabel: '护理',
      showPrice: false
    }, 'store-config-request-001');
    const project = await updateStoreAppointmentServiceCatalog('basic-service', {
      storeCode: 'store-config-001',
      categoryId: 'general',
      name: '基础护理',
      summary: '适合首次体验',
      durationMinutes: 75,
      priceText: '到店咨询',
      showPrice: false,
      enabled: true
    }, 'store-config-request-002');
    const staff = await updateStoreAppointmentStaffRoster('staff-001', {
      storeCode: 'store-config-001',
      name: '员工 A',
      role: '主理人',
      bio: '擅长基础服务',
      avatarUrl: '',
      trustHighlights: ['3 年经验'],
      enabled: true,
      projectCodes: ['basic-service']
    }, 'store-config-request-003');
    const rules = await updateStoreAppointmentRules('store-config-001', {
      bookingWindowDays: 21,
      defaultDurationMinutes: 75,
      defaultSlots: ['09:30', '15:00'],
      confirmationHint: '到店前确认',
      cancelHint: '如需取消请提前联系'
    }, 'store-config-request-004');

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/store-appointment-config/stores/store-config-001', {
      method: 'PUT',
      body: JSON.stringify({
        name: '新门店名',
        industry: 'beauty',
        phone: '0571-00000001',
        address: '杭州市示例路 2 号',
        businessHours: '09:00-21:00',
        staffLabel: '老师',
        projectLabel: '护理',
        showPrice: false
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': 'store-config-request-001'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/store-appointment-config/projects/basic-service', {
      method: 'PUT',
      body: JSON.stringify({
        storeCode: 'store-config-001',
        categoryId: 'general',
        name: '基础护理',
        summary: '适合首次体验',
        durationMinutes: 75,
        priceText: '到店咨询',
        showPrice: false,
        enabled: true
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': 'store-config-request-002'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/store-appointment-config/staff/staff-001', {
      method: 'PUT',
      body: JSON.stringify({
        storeCode: 'store-config-001',
        name: '员工 A',
        role: '主理人',
        bio: '擅长基础服务',
        avatarUrl: '',
        trustHighlights: ['3 年经验'],
        enabled: true,
        projectCodes: ['basic-service']
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': 'store-config-request-003'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(4, '/api/admin/store-appointment-config/rules/store-config-001', {
      method: 'PUT',
      body: JSON.stringify({
        bookingWindowDays: 21,
        defaultDurationMinutes: 75,
        defaultSlots: ['09:30', '15:00'],
        confirmationHint: '到店前确认',
        cancelHint: '如需取消请提前联系'
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': 'store-config-request-004'
      }
    });
    expect(storeProfile.name).toBe('新门店名');
    expect(project.durationMinutes).toBe(75);
    expect(staff.projectCodes).toEqual(['basic-service']);
    expect(rules.bookingWindowDays).toBe(21);
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
