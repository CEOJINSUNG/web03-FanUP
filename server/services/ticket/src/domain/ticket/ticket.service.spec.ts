import { INestApplication } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { MICRO_SERVICES } from '../../common/constants/microservices';
import { PrismaService } from '../../provider/prisma/prisma.service';
import { TicketModule } from './ticket.module';
import { TicketService } from './ticket.service';
import CreateTicketDto from './dto/create-ticket.dto';
import { CustomRpcException } from '../../common/exception/custom-rpc-exception';

jest.mock('../../provider/prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    ticket: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

describe('TicketService', () => {
  let app: INestApplication;
  let service: TicketService;
  let prisma: PrismaService;
  let core: ClientProxy;
  let event: EventEmitter2;

  const createTicketDto: CreateTicketDto = {
    title: 'title',
    content: 'content',
    artistId: 1,
    salesTime: new Date(),
    startTime: new Date(),
    totalAmount: 1,
    numberTeam: 1,
    timeTeam: 1,
    price: 1,
  };

  const ticket = {
    id: 1,
    title: 'title',
    content: 'content',
    createdAt: new Date(),
    updatedAt: new Date(),
    artistId: 1,
    salesTime: new Date(),
    startTime: new Date(),
    status: 'OPEN',
    totalAmount: 1,
    numberTeam: 1,
    timeTeam: 1,
    price: 1,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TicketModule,
        ClientsModule.register([
          { name: MICRO_SERVICES.CORE.NAME, transport: Transport.TCP },
        ]),
      ],
      providers: [TicketService, PrismaService, EventEmitter2],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<TicketService>(TicketService);
    prisma = module.get<PrismaService>(PrismaService);
    core = module.get<ClientProxy>(MICRO_SERVICES.CORE.NAME);
    event = module.get<EventEmitter2>(EventEmitter2);
    event.emit = jest.fn();
  });

  afterAll(() => {
    app.close();
    jest.resetModules();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getTicketHello 테스트', () => {
    expect(service.getTicketHello()).toEqual('Ticket server is running!');
  });

  it('create 테스트', async () => {
    prisma.ticket.create = jest.fn().mockResolvedValue(ticket);
    expect(await service.create(createTicketDto)).toEqual(ticket);
  });

  it('find 성공 테스트', async () => {
    prisma.ticket.findUniqueOrThrow = jest.fn().mockResolvedValue(ticket);
    expect(await service.find(1)).toEqual(ticket);
  });

  it('find 실패 테스트', async () => {
    try {
      prisma.ticket.findUniqueOrThrow = jest.fn().mockImplementation(() => {
        throw new Error();
      });
      await service.find(1);
    } catch (err) {
      expect(err).toBeInstanceOf(CustomRpcException);
      expect(err.message).toEqual('Ticket not found');
    }
  });

  it('findAll 테스트', async () => {
    prisma.ticket.findMany = jest.fn().mockResolvedValue([ticket]);
    expect(await service.findAll()).toEqual([ticket]);
  });

  it('delete 테스트', async () => {
    prisma.ticket.delete = jest.fn().mockResolvedValue(ticket);
    expect(await service.delete(1)).toEqual(ticket);
  });

  it('update 테스트', async () => {
    prisma.ticket.update = jest.fn().mockResolvedValue(ticket);
    expect(await service.update(1, createTicketDto)).toEqual(ticket);
  });

  it('findAllByUserId 테스트', async () => {
    prisma.ticket.findMany = jest
      .fn()
      .mockResolvedValue([{ ...ticket, userTickets: [{ fanupId: '1' }] }]);
    expect(await service.findAllByUserId(1)).toEqual([
      { ...ticket, fanupId: '1' },
    ]);
  });

  it('findAllTicketByDate 테스트', async () => {
    prisma.ticket.findMany = jest.fn().mockResolvedValue([ticket]);
    expect(
      await service.findAllTicketByDate({
        artistId: 1,
        year: 2022,
        month: 12,
      }),
    ).toEqual([ticket]);
  });
});
