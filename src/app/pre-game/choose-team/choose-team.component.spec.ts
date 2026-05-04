import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseTeamComponent } from './choose-team.component';
import { GameService } from '../../services/game.service';
import { Subject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ChooseTeamComponent', () => {
  let component: ChooseTeamComponent;
  let fixture: ComponentFixture<ChooseTeamComponent>;
  let gameServiceMock: any;

  beforeEach(async () => {
    gameServiceMock = {
      reset$: new Subject<void>(),
      notifyDataChanged: jasmine.createSpy('notifyDataChanged')
    };

    await TestBed.configureTestingModule({
      imports: [
        ChooseTeamComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: GameService, useValue: gameServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseTeamComponent);
    component = fixture.componentInstance;

    localStorage.clear();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // --- AVATAR POOL TESTS ---

  it('should initialize a full pool of 14 avatars on start', () => {
    // Zmienione z 15 na 14 zgodnie z zawartością folderu
    expect(component.availableAvatarIds.length).toBe(14);
    expect(component.availableAvatarIds).toContain(1);
    expect(component.availableAvatarIds).toContain(14);
  });

  it('should exclude occupied avatars from the available pool', () => {
    component.teams = [
      { id: 1, name: 'Team 1', points: 0, avatarUrl: '/avatars/5.png' },
      { id: 2, name: 'Team 2', points: 0, avatarUrl: '/avatars/10.png' }
    ];

    component.prepareAvailableAvatars();

    expect(component.availableAvatarIds).not.toContain(5);
    expect(component.availableAvatarIds).not.toContain(10);
    // 14 dostępnych - 2 zajęte = 12
    expect(component.availableAvatarIds.length).toBe(12);
  });

  // --- TEAM MANAGEMENT TESTS ---

  it('should add a new team and assign a unique avatar', () => {
    const initialPoolSize = component.availableAvatarIds.length;
    component.newTeamName = 'Winners Team';

    component.addTeam();

    expect(component.teams.length).toBe(1);
    expect(component.teams[0].name).toBe('Winners Team');
    expect(component.teams[0].avatarUrl).toMatch(/\/avatars\/\d+\.png$/);
    expect(component.availableAvatarIds.length).toBe(initialPoolSize - 1);
  });

  it('should not add a team if the name is shorter than 4 characters', () => {
    component.newTeamName = 'ABC';
    component.addTeam();
    expect(component.teams.length).toBe(0);
  });

  it('should remove a team and return its avatar to the pool', () => {
    component.newTeamName = 'Test Team';
    component.addTeam();

    const assignedAvatarUrl = component.teams[0].avatarUrl;
    const match = assignedAvatarUrl.match(/(\d+)\.png$/);
    const avatarId = match ? parseInt(match[1], 10) : null;

    // Use non-null assertion (!) to fix TS2345
    expect(component.availableAvatarIds).not.toContain(avatarId!);

    component.removeTeam(component.teams[0].id);

    expect(component.teams.length).toBe(0);
    expect(component.availableAvatarIds).toContain(avatarId!);
  });

  // --- RESET AND INTEGRATION TESTS ---

  it('should clear teams and newTeamName when game reset signal is received', () => {
    component.teams = [{ id: 1, name: 'T1', points: 0, avatarUrl: '/avatars/1.png' }];
    component.newTeamName = 'Some Name';

    gameServiceMock.reset$.next();

    expect(component.teams.length).toBe(0);
    expect(component.newTeamName).toBe('');
  });

  it('should correctly generate consecutive IDs for new teams', () => {
    component.teams = [{ id: 10, name: 'Old Team', points: 0, avatarUrl: '/avatars/1.png' }];
    expect(component.getNextId()).toBe(11);
  });

  it('should call notifyDataChanged on GameService when teams are saved', () => {
    component.newTeamName = 'Notification Team';
    component.addTeam();

    expect(gameServiceMock.notifyDataChanged).toHaveBeenCalled();
  });
});
