// import { Test, TestingModule } from '@nestjs/testing';
// import { BadRequestException } from '@nestjs/common';
// import { AdminService } from './admin.service';
// import { AdminRepository } from 'src/database/infra/repositories/AdminRepositories';
// import { createPatientSwagger } from 'src/common/doc/createPatientSwagger';
// import { updatePatientSwagger } from 'src/common/doc/updatePatientSwagger';
// import Patient from 'src/database/typeorm/Patient.entities';

// describe('AdminService', () => {
//   let adminService: AdminService;
//   let adminRepository: AdminRepository;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AdminService,
//         {
//           provide: AdminRepository,
//           useValue: {
//             // Mock or provide necessary functions here for testing
//             findPatientByEmail: jest.fn(),
//             createPatient: jest.fn(),
//             findPatientById: jest.fn(),
//             getPatientWithoutEmail: jest.fn(),
//             getAllPatients: jest.fn(),
//             updateOnePatient: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     adminService = module.get<AdminService>(AdminService);
//     adminRepository = module.get<AdminRepository>(AdminRepository);
//   });

//   describe('createPatient', () => {
//     it('should create a patient', async () => {
//       const patientData: createPatientSwagger = {
//         // Provide test data here
//       };

//       adminRepository.findPatientByEmail.mockResolvedValue(undefined);
//       adminRepository.createPatient.mockResolvedValue(patientData);

//       const result = await adminService.createPatient(patientData);

//       expect(result).toEqual(patientData);
//     });

//     it('should throw BadRequestException when passwords do not match', async () => {
//       const patientData: createPatientSwagger = {
//         // Provide test data here
//         password: 'password1',
//         confirmPassword: 'password2',
//       };

//       await expect(adminService.createPatient(patientData)).rejects.toThrow(
//         BadRequestException,
//       );
//     });

//     // Add more test cases as needed
//   });

//   // Add more describe blocks for other functions (e.g., findPatientByEmail, updateOnePatient, etc.)
// });
