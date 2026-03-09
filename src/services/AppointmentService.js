import httpService from './HttpService';

class AppointmentService {
  async bookAppointment(patientId, doctorId, appointmentTime) {
    try {
      const response = await httpService.post(
        `/patient/appointment?patientId=${patientId}&doctorId=${doctorId}`,
        { appointmentTime }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getPatientAppointments(patientId) {
    try {
      const response = await httpService.get(`/patient/appointments?patientId=${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getDoctorAppointments(doctorId) {
    try {
      const response = await httpService.get(`/doctor/appointments?doctorId=${doctorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new AppointmentService();